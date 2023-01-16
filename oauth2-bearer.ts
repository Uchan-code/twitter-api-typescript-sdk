// Copyright 2021 Twitter, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Client } from "twitter-api-sdk";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const client = new Client(process.env.BEARER_TOKEN as string);
  /** UserNameからclient情報を取得する
   * （Ex. Cl_youのclientオブジェクトを取得
   * 　id,name,usernameのフィールドオブジェクトを生成）   
   *  
   * 　指定したIdのTweetを取得する
   * 　probrem➀
   *  →tweetsObjにはUserIdのキーを持っていなかった
   *  →定義が足りてなかった
   *  →UserIdのtweetを取得というよりはUserIdでフィルタリング
   * 
   *   probrem➁
   *  →フィルタリング機能
  */
  const { data } = await client.users.findUserByUsername("Cl_you");
  if (!data) throw new Error("Couldn't find user");
  let count = 0;
  
  for await (const followers of client.users.usersIdFollowers(data.id)) {
    if (++count == 3) {
      break;
    }
  }

  // 取得したツイートが処理できる
  const stream = client.tweets.searchStream({
    "tweet.fields": ["author_id", "geo","lang","public_metrics"],
  });
  for await (const tweet of stream) {

    if(tweet.data?.public_metrics?.like_count == undefined){
      continue;
    }

    if(tweet.data?.public_metrics?.like_count >= 10){
      console.log(tweet.data)
    }
  }
}

async function filterTweetsbyId() {
  const client = new Client(process.env.BEARER_TOKEN as string);
  await client.tweets.addOrDeleteRules(
    {
      add: [
        {value: "LeagueOfLegend", tag: "LeagueOfLegends"}
      ]
    }
  );
  
  const rules = await client.tweets.getRules();
  console.log(rules);
  const stream = client.tweets.searchStream({
    "tweet.fields": ["author_id", "geo"],
  });
  for await (const tweet of stream) {
    console.log(tweet.data);
  }
}

async function filterTweetsByFollower(){
  const client = new Client(process.env.BEARER_TOKEN as string);
  const stream = client.tweets.searchStream({
    "tweet.fields": ["author_id", "geo","lang","public_metrics"],
  });

  for await (const tweet of stream) {

    // ガード節　tweetIdがundefind
    if(tweet.data?.public_metrics?.like_count == undefined){
      continue;
    }

    // Likeが10カウント以上の場合
    if(tweet.data?.public_metrics?.like_count >= 10){
      console.log(tweet.data)
    }
  }
}

// 自分がいいねしたtweetを取得
async function getLikeTweetbyUserName(){
  const client = new Client(process.env.BEARER_TOKEN as string);
  const { data } = await client.users.findUserByUsername("Cl_you");
  if (!data) throw new Error("Couldn't find user");
  
  const tweets = client.tweets.usersIdLikedTweets(data.id)
  for await (const tweet of tweets) {
    console.log(tweet);
  }
}

// フォロワーのtweetを取得
async function getTweetsFromFollower(){
  const client = new Client(process.env.BEARER_TOKEN as string);
  const { data } = await client.users.findUserByUsername("Cl_you");
  if (!data) throw new Error("Couldn't find user");
  let count = 0;

  const follower = await client.users.usersIdFollowers(data.id)
  console.log(follower);
}

// filterTweetsbyId()
// main();
// getLikeTweetbyUserName();
getTweetsFromFollower()

