#!/usr/bin/env python3
"""
X API Automation Script for Raider Tracking
This script demonstrates how to use the X API to automate raider verification
and engagement tracking for the Raider Tracking System.
"""

import sys
import json
import time
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

# Add the Manus API client path
sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient

class RaiderTracker:
    def __init__(self):
        self.client = ApiClient()
        self.raiders = []
        self.rate_limit_delay = 60  # seconds between API calls to avoid rate limits
        
    def get_user_profile(self, username: str) -> Dict[str, Any]:
        """
        Fetch a Twitter user's profile information.
        
        Args:
            username (str): Twitter username (e.g., raider1)
        
        Returns:
            Dict[str, Any]: User profile data
        """
        try:
            response = self.client.call_api('Twitter/get_user_profile_by_username', 
                                          query={'username': username})
            
            if response and 'result' in response:
                user_data = response['result']['data']['user']['result']
                return {
                    'username': username,
                    'user_id': user_data.get('rest_id'),
                    'verified': user_data.get('verification', {}).get('verified', False),
                    'is_blue_verified': user_data.get('is_blue_verified', False),
                    'followers_count': user_data.get('legacy', {}).get('followers_count', 0),
                    'following_count': user_data.get('legacy', {}).get('friends_count', 0),
                    'tweet_count': user_data.get('legacy', {}).get('statuses_count', 0),
                    'account_created': user_data.get('core', {}).get('created_at'),
                    'profile_image': user_data.get('avatar', {}).get('image_url'),
                    'last_checked': datetime.now().isoformat()
                }
        except Exception as e:
            print(f"Error fetching profile for {username}: {str(e)}")
            return None
    
    def get_user_tweets(self, user_id: str, count: int = 20) -> List[Dict[str, Any]]:
        """
        Fetch recent tweets from a user.
        
        Args:
            user_id (str): User ID from profile data
            count (int): Number of tweets to fetch
        
        Returns:
            List[Dict[str, Any]]: List of tweet data
        """
        try:
            response = self.client.call_api('Twitter/get_user_tweets', 
                                          query={'user': user_id, 'count': str(count)})
            
            tweets = []
            if response and 'result' in response:
                timeline = response['result']['timeline']
                instructions = timeline.get('instructions', [])
                
                for instruction in instructions:
                    if instruction.get('type') == 'TimelineAddEntries':
                        entries = instruction.get('entries', [])
                        for entry in entries:
                            if entry.get('entryId', '').startswith('tweet-'):
                                content = entry.get('content', {})
                                if 'itemContent' in content:
                                    tweet_results = content['itemContent'].get('tweet_results', {})
                                    if 'result' in tweet_results:
                                        tweet_data = tweet_results['result']
                                        legacy = tweet_data.get('legacy', {})
                                        
                                        tweets.append({
                                            'tweet_id': legacy.get('id_str'),
                                            'text': legacy.get('full_text', ''),
                                            'created_at': legacy.get('created_at'),
                                            'retweet_count': legacy.get('retweet_count', 0),
                                            'favorite_count': legacy.get('favorite_count', 0),
                                            'reply_count': legacy.get('reply_count', 0),
                                            'quote_count': legacy.get('quote_count', 0),
                                            'is_retweet': bool(legacy.get('retweeted_status_result')),
                                            'is_reply': bool(legacy.get('in_reply_to_status_id_str'))
                                        })
            
            return tweets
        except Exception as e:
            print(f"Error fetching tweets for user {user_id}: {str(e)}")
            return []
    
    def search_tweets(self, query: str) -> List[Dict[str, Any]]:
        """
        Search for tweets matching a query (e.g., to find raider interactions).
        
        Args:
            query (str): Search query
        
        Returns:
            List[Dict[str, Any]]: List of matching tweets
        """
        try:
            response = self.client.call_api('Twitter/search_twitter', 
                                          query={'q': query})
            
            # Process search results (implementation depends on actual API response structure)
            # This is a placeholder for the search functionality
            return []
        except Exception as e:
            print(f"Error searching tweets: {str(e)}")
            return []
    
    def verify_raider_activity(self, raider_username: str, target_post_url: str) -> Dict[str, Any]:
        """
        Verify if a raider has interacted with a specific post.
        
        Args:
            raider_username (str): Raider's X username
            target_post_url (str): URL of the post to check
        
        Returns:
            Dict[str, Any]: Verification results
        """
        # Extract tweet ID from URL
        tweet_id = target_post_url.split('/')[-1]
        
        # Get raider profile
        profile = self.get_user_profile(raider_username)
        if not profile:
            return {'error': 'Could not fetch raider profile'}
        
        # Get recent tweets to check for retweets/quotes
        recent_tweets = self.get_user_tweets(profile['user_id'], 50)
        
        # Check for interactions
        interactions = {
            'retweeted': False,
            'quoted': False,
            'replied': False,
            'liked': False,  # Cannot verify likes via API
            'profile_verified': profile['verified'] or profile['is_blue_verified'],
            'last_activity': None
        }
        
        for tweet in recent_tweets:
            if tweet_id in tweet.get('text', ''):
                if tweet['is_retweet']:
                    interactions['retweeted'] = True
                elif tweet['is_reply']:
                    interactions['replied'] = True
                else:
                    interactions['quoted'] = True
                
                interactions['last_activity'] = tweet['created_at']
                break
        
        return interactions
    
    def batch_verify_raiders(self, raiders_data: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        """
        Verify multiple raiders in batch with rate limiting.
        
        Args:
            raiders_data (List[Dict]): List of raider data with username and target_post_url
        
        Returns:
            List[Dict[str, Any]]: Verification results for all raiders
        """
        results = []
        
        for i, raider in enumerate(raiders_data):
            print(f"Verifying raider {i+1}/{len(raiders_data)}: {raider['username']}")
            
            # Verify raider activity
            verification = self.verify_raider_activity(
                raider['username'], 
                raider['target_post_url']
            )
            
            results.append({
                'username': raider['username'],
                'target_post_url': raider['target_post_url'],
                'verification': verification,
                'timestamp': datetime.now().isoformat()
            })
            
            # Rate limiting - wait between requests
            if i < len(raiders_data) - 1:
                print(f"Waiting {self.rate_limit_delay} seconds to avoid rate limits...")
                time.sleep(self.rate_limit_delay)
        
        return results
    
    def generate_daily_report(self, raiders_data: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Generate a daily verification report for all raiders.
        
        Args:
            raiders_data (List[Dict]): List of raider data
        
        Returns:
            Dict[str, Any]: Daily report
        """
        verification_results = self.batch_verify_raiders(raiders_data)
        
        # Analyze results
        total_raiders = len(verification_results)
        verified_accounts = sum(1 for r in verification_results 
                              if r['verification'].get('profile_verified', False))
        active_raiders = sum(1 for r in verification_results 
                           if any([r['verification'].get('retweeted', False),
                                 r['verification'].get('quoted', False),
                                 r['verification'].get('replied', False)]))
        
        report = {
            'date': datetime.now().strftime('%Y-%m-%d'),
            'total_raiders': total_raiders,
            'verified_accounts': verified_accounts,
            'active_raiders': active_raiders,
            'verification_rate': (verified_accounts / total_raiders * 100) if total_raiders > 0 else 0,
            'activity_rate': (active_raiders / total_raiders * 100) if total_raiders > 0 else 0,
            'detailed_results': verification_results
        }
        
        return report

def main():
    """
    Example usage of the RaiderTracker class.
    """
    tracker = RaiderTracker()
    
    # Example raider data
    raiders_data = [
        {
            'username': 'raider1',
            'target_post_url': 'https://x.com/user/status/1234567890'
        },
        {
            'username': 'raider2', 
            'target_post_url': 'https://x.com/user/status/1234567890'
        },
        {
            'username': 'raider3',
            'target_post_url': 'https://x.com/user/status/1234567890'
        }
    ]
    
    print("X Raider Tracker - Automation Script")
    print("=" * 50)
    
    # Test single raider verification
    print("\n1. Testing single raider verification...")
    single_result = tracker.verify_raider_activity(
        'raider1', 
        'https://x.com/user/status/1234567890'
    )
    print(f"Single verification result: {json.dumps(single_result, indent=2)}")
    
    # Test batch verification (commented out to avoid rate limits in demo)
    # print("\n2. Running batch verification...")
    # daily_report = tracker.generate_daily_report(raiders_data)
    # print(f"Daily report: {json.dumps(daily_report, indent=2)}")
    
    print("\nAutomation script completed!")

if __name__ == "__main__":
    main()
