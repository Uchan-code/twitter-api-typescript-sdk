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
   * 　probrem
   *  →tweetsObjにはUserIdのキーを持っていなかった
   *  →
  */
  // const { data } = await client.users.findUserByUsername("Cl_you");
  
  // if (!data) throw new Error("Couldn't find user");
  // let count = 0;
  // for await (const followers of client.users.usersIdFollowers(data.id)) {
  //   console.log(followers);
  //   if (++count == 3) {
  //     break;
  //   }
  // }

  const stream = client.tweets.sampleStream({
    "tweet.fields": ["author_id", "geo"],
  });
  for await (const tweet of stream) {
    console.log(tweet.data);
  }
}

main();

