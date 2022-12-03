var { faker } = require('@faker-js/faker');
var mysql = require('mysql2');
const prompt = require("prompt-sync")();

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Zelda314",
});

function createFakeTweet(personID) {
  return [
    faker.hacker.phrase(),
    faker.date.past(),
    personID,
  ];
}

function createNewUser() {
    const first = faker.name.firstName();
    const last = faker.name.lastName();
  return [
    first,
    last,
    first + last,
    faker.internet.password(),
    faker.image.avatar(),
    faker.lorem.lines(1),
    faker.phone.number(),
    faker.date.past(),
  ];
}


const init = async (queryToRun) => {
    try {
        const mysql2 = require('mysql2/promise');
      const db = await mysql2.createConnection({
        host: "localhost",
        user: "root",
        password: "Zelda314",
    });
    
      const [rows, fields] = await db.query(queryToRun);
      db.end();
      return rows;
    } catch (err) {
      console.log('An error occurred while fetching the sql: ', err);
    }
  };


  async function main() {
        console.log("What would you like to do? Type view-users to view users, type new-tweet to add some sample tweets, type new-user to add a new user, delete-tweet to delete someones tweet, or type delete-account to delete a user.");
    var option = prompt("");

    if (option == 'view-users') {
        const rows = await init('SELECT * FROM SocialMedia.users ORDER BY user_name');
 
        for(let i = 0; i<rows.length;i++) {
            console.log(rows[i].user_name);
        }

        const option = prompt("Enter the username of the user whose info you would like to view");

        const userinfo = await init('SELECT * FROM SocialMedia.users WHERE user_name = ' + '"' + option + '"');

        console.log('User info for ' + userinfo[0].user_name + ": ");

        console.log('First name ' + userinfo[0].user_firstName);
        console.log('Last name ' + userinfo[0].user_lastName);
        console.log('Bio name ' + userinfo[0].bioText);
        console.log('Phone number ' + userinfo[0].mobilePhone);
        console.log('Register date ' + userinfo[0].registerDate);

        const numberOfTweets = await init('SELECT COUNT(tweet_id) AS num_tweets FROM SocialMedia.user_tweets WHERE user_id = ' + '"' + userinfo[0].user_id + '"');
   
        console.log('The user has ' + numberOfTweets[0].num_tweets + ' tweets ');

        const numFollowees = await init('SELECT COUNT(user_follower_id) AS num_followees FROM SocialMedia.user_followers WHERE user_follower_id = ' + '"' + userinfo[0].user_id + '"');
   
        console.log('The user has ' + numFollowees[0].num_followers + ' followers ');

        const numFollowers = await init('SELECT COUNT(current_user_id) AS num_followers FROM SocialMedia.user_followers WHERE current_user_id = ' + '"' + userinfo[0].user_id + '"');
   
        console.log('The user is following ' + numFollowers[0].num_followees + ' people ');
    } else if (option == 'insert-users') {
      
        const newUsers = [];
        for(let i = 0; i < 30; i++) {
            newUsers.push(createNewUser());
        }
        
        var sql = "INSERT INTO SocialMedia.users (user_firstName, user_lastName, user_name, user_password, user_avatar, bioText, mobilePhone, registerDate) VALUES ?";

        connection.query({
            sql: sql,
            values: [newUsers], function(err, res) {
                console.log(err);
                console.log(res);
    }});
    
    } else if (option == "new-tweet") {

        const rows = await init('SELECT * FROM SocialMedia.users ORDER BY user_name');
        
        for(let i = 0; i<rows.length;i++) {
            console.log(rows[i].user_name);
        }

        const option = prompt("Enter the username of the user whose tweets you want to generate");

        const personID = await init('SELECT * FROM SocialMedia.users WHERE user_name = ' + '"' + option + '"');

        const fakeTweets = [];
        for(let i = 0; i < 30; i++) {
            fakeTweets.push(createFakeTweet(personID[0].user_id));
        }

        var sql = "INSERT INTO SocialMedia.user_tweets (tweet_text, date_posted, user_id) VALUES ?";
        
        connection.query({
            sql: sql,
            values: [fakeTweets], function(err, res) {
                console.log(err);
                console.log(res);
    }});
    } else if (option =="delete-tweet") {
        const rows = await init('SELECT * FROM SocialMedia.users ORDER BY user_name');
        
        for(let i = 0; i<rows.length;i++) {
            console.log(rows[i].user_name);
        }

        const option = prompt("Enter the username of the user whose info you would like to view");

        const getUserID = await init('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + option + '"');
        
        const userinfo = await init('SELECT * FROM SocialMedia.user_tweets WHERE user_id = ' + '"' + getUserID[0].user_id + '"');

        for(let i = 0; i<userinfo.length;i++) {
            console.log("ID " + userinfo[i].tweet_id);
            console.log("Text " + userinfo[i].tweet_text);
            console.log("Date Posted " + userinfo[i].date_posted);
            console.log("\n");
        }

        const deleteTweetPrompt = prompt("Enter the ID of the tweet you would like to delete");

        await init('DELETE FROM SocialMedia.user_tweets WHERE user_id = ' + '"' + getUserID[0].user_id + '" AND tweet_id = ' + '"' + deleteTweetPrompt + '"');
    } else if (option =="delete-account") {
        const rows = await init('SELECT * FROM SocialMedia.users ORDER BY user_name');
        
        for(let i = 0; i<rows.length;i++) {
            console.log(rows[i].user_name);
        }

        const option = prompt("Enter the username of the user whose tweet you want to delete");

        const getUserID = await init('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + option + '"');
        
        await init('DELETE FROM SocialMedia.users WHERE user_id = ' + '"' + getUserID[0].user_id + '" AND user_name = ' + '"' + option + '"');
    } else if (option =="follow-user") {
        const rows = await init('SELECT * FROM SocialMedia.users ORDER BY user_name');
        
        for(let i = 0; i<rows.length;i++) {
            console.log(rows[i].user_name);
        }

        const followFirstUser = prompt("Select an account");

        const getUserID = await init('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + followFirstUser + '"');

        const followSecondUser = prompt("Select an account who you want " + followFirstUser + " to follow");

        const getSecondUserID = await init('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + followSecondUser + '"');
  
        const isFollowing = await init("SELECT * from SocialMedia.user_followers WHERE EXISTS(SELECT * FROM SocialMedia.user_followers WHERE user_follower_id = " + "'" + getUserID[0].user_id + "' AND current_user_id = " + "'" + getSecondUserID[0].user_id + "')")

        if(0 < isFollowing.length) {
            await init('DELETE FROM SocialMedia.user_followers WHERE user_follower_id = ' + '"' + getUserID[0].user_id + '" AND current_user_id = ' + '"' + getSecondUserID[0].user_id + '"')
        } else {
            await init("INSERT INTO SocialMedia.user_followers (user_follower_id, current_user_id) VALUES (" + '"' + getUserID[0].user_id + '", "' + getSecondUserID[0].user_id + '")');
        }
    } else {
        console.log("What would you like to do? Type view-users to view users, type new-tweet to add some sample tweets, type new-user to add a new user, delete-tweet to delete someones tweet, or type delete-account to delete a user.");
        option = prompt("");
    }
    console.log("\r\n"); 
    console.log("What would you like to do? Type view-users to view users, type new-tweet to add some sample tweets, type new-user to add a new user, delete-tweet to delete someones tweet, or type delete-account to delete a user.");
    option = prompt("");
}

  main();