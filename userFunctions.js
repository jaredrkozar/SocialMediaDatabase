const common = require("./commonFunctions");
const prompt = require("prompt-sync")();

async function listUsers(userPrompt) {
    option = "next"
    var userOffset = 0;

    while(option == "next") {

        const userinfo = await common.getData('SELECT * FROM SocialMedia.users ORDER BY user_name LIMIT 5 OFFSET ' + userOffset);

        for(let i = 0; i<userinfo.length;i++) {
            console.log(userinfo[i].user_name);
        }
        userOffset = userOffset + 5;
        
        option = prompt(userPrompt + " Enter next to view the next 5 users in the list ");
    }
    return option
}

async function listTweets(tweetPrompt, id) {
    option = "next"
    var tweetOffset = 0;

    while(option == "next") {
        console.log(id)
        const userinfo = await common.getData('SELECT * FROM SocialMedia.user_tweets WHERE user_id = ' + '"' + id + '" LIMIT 5 OFFSET ' + tweetOffset);
       
        for(let i = 0; i<userinfo.length;i++) {
            console.log("ID " + userinfo[i].tweet_id);
            console.log("Text " + userinfo[i].tweet_text);
            console.log("Date Posted " + userinfo[i].date_posted);
            console.log("\n");
        }

        tweetOffset = tweetOffset + 5;
        
        option = prompt(tweetPrompt + " Enter next to view the next 5 tweets in the list ");
    }
    return parseInt(option);
}

async function deleteTweet() {
    const username = await listUsers("Enter the username of the user whose tweet you would like to delete.");
    const userinfo = await common.getData('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + username + '"');

    const numberOfTweets = await common.getData('SELECT COUNT(user_id) AS num_tweets FROM SocialMedia.user_tweets WHERE user_id = ' + '"' + userinfo[0].user_id + '"');

    if (numberOfTweets != undefined) {
        
        const getUserID = await common.getData('SELECT user_id, user_name FROM SocialMedia.users WHERE user_name = ' + '"' + option + '"');
        
        const userinfo = await common.getData('SELECT * FROM SocialMedia.user_tweets WHERE user_id = ' + '"' + getUserID[0].user_id + '"');
        if (userinfo.length == 0) {
            console.log("The user " + getUserID[0].user_name + ' has no tweets')
        } else {
            const tweetid = await listTweets("Enter the ID of the tweet you would like to delete", getUserID[0].user_id)
        
            await common.getData('DELETE FROM SocialMedia.user_tweets WHERE user_id = ' + '"' + getUserID[0].user_id + '" AND tweet_id = ' + '"' + tweetid + '"');
        }
    } else {
        console.log("you need to add some users!")
    }
}

async function insertUsers() {
    console.log("Inserting 30 random users into the database...")
    
    const newUsers = [];

    const lastUser = await common.getData('SELECT user_id FROM SocialMedia.users ORDER BY user_id');

    var lastUserIDNumber = 0;

    if (lastUser.length != 0) {
        const lastUserID = lastUser[lastUser.length - 1]
        console.log(lastUserID)
        lastUserIDNumber = (lastUserID != undefined ? lastUserID.user_id : 0)
    }
  
    for(let i = lastUserIDNumber; i<lastUserIDNumber + 30;i++) {
        newUsers.push(common.createNewUser());
    }
    console.log(newUsers)
    var insertQuery = "INSERT INTO SocialMedia.users (user_firstName, user_lastName, user_name, user_password, user_avatar, bioText, mobilePhone, registerDate) VALUES ?";

    common.connection.query(insertQuery, [newUsers], (err, res) => {
        console.log(err, res);
        console.log("ENDED")
    });
}

async function viewUser() {
    const rows = await common.getData('SELECT * FROM SocialMedia.users ORDER BY user_name LIMIT 5 OFFSET 0');

    if(rows.length != 0) {
        const username = await listUsers("Enter the username of the user whose info you would like to view.");
    
        const userinfo = await common.getData('SELECT * FROM SocialMedia.users WHERE user_name = ' + '"' + username + '"');

        console.log('User info for ' + userinfo[0].user_name + ": ");
    
        console.log('First name ' + userinfo[0].user_firstName);
        console.log('Last name ' + userinfo[0].user_lastName);
        console.log('Bio name ' + userinfo[0].bioText);
        console.log('Phone number ' + userinfo[0].mobilePhone);
        console.log('Register date ' + userinfo[0].registerDate);
    
        const numberOfTweets = await common.getData('SELECT COUNT(tweet_id) AS num_tweets FROM SocialMedia.user_tweets WHERE user_id = ' + '"' + userinfo[0].user_id + '"');
    
        console.log('The user has ' + numberOfTweets[0].num_tweets + ' tweets ');
    
        const numFollowers = await common.getData('SELECT COUNT(current_user_id) AS num_followers FROM SocialMedia.user_followers WHERE current_user_id = ' + '"' + userinfo[0].user_id + '"');
    
        console.log('The user is following ' + numFollowers[0].num_followers + ' users ');
    
        const numFollowees = await common.getData('SELECT COUNT(user_followee_id) AS num_followees FROM SocialMedia.user_followees WHERE user_followee_id = ' + '"' + userinfo[0].user_id + '"');
    
        console.log('The user has ' + numFollowees[0].num_followees + ' followers ');

        const numTweetsLiked = await common.getData('SELECT COUNT(original_user_id) AS num_tweets_liked FROM SocialMedia.user_likes WHERE original_user_id = ' + '"' + userinfo[0].user_id + '"');
    
        console.log('The user has their tweets liked by ' + numTweetsLiked[0].num_tweets_liked + ' people');
    } else {
        console.log("you need to hire some users!")
    }
}

async function insertTweets() {

    const rows = await common.getData('SELECT * FROM SocialMedia.users ORDER BY user_name');
        
    if (rows.length != 0) {

        const username = await listUsers();

        const personID = await common.getData('SELECT * FROM SocialMedia.users WHERE user_name = ' + '"' + username + '"');
        
        const fakeTweets = [];
        for(let i = 0; i < 30; i++) {
            fakeTweets.push(common.createFakeTweet(personID[0].user_id));
        }
    
        var insertTweetSQL = "INSERT INTO SocialMedia.user_tweets (tweet_text, date_posted, user_id) VALUES ?";
    
        const getuserName = await common.getData('SELECT user_name FROM SocialMedia.users WHERE user_id = ' + '"' + personID[0].user_id + '"');
    
        console.log('Inserting 30 random tweets into ' + getuserName[0].user_name + 'account')
        common.connection.query(insertTweetSQL, [fakeTweets], (err, res) => {
            console.log(err, res);
        });
    }
    
}

async function followUser() {

        const username = await listUsers();

        const followSecondUser = prompt("Select an account who you want " + username + " to follow");

        const getSecondUserID = await common.getData('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + followSecondUser + '"');

        const isFollowing = await common.getData("SELECT * from SocialMedia.user_followers WHERE EXISTS(SELECT * FROM SocialMedia.user_followers WHERE user_follower_id = " + "'" + getUserID[0].user_id + "' AND current_user_id = " + "'" + getSecondUserID[0].user_id + "')")

        if(0 < isFollowing.length) {
            await common.getData('DELETE FROM SocialMedia.user_followers WHERE user_follower_id = ' + '"' + getUserID[0].user_id + '" AND current_user_id = ' + '"' + getSecondUserID[0].user_id + '"')
            await common.getData('DELETE FROM SocialMedia.user_followees WHERE user_followee_id = ' + '"' + getSecondUserID[0].user_id + '" AND current_user_id = ' + '"' + getUserID[0].user_id + '"')
        } else {
            await common.getData("INSERT INTO SocialMedia.user_followers (user_follower_id, current_user_id) VALUES (" + '"' + getUserID[0].user_id + '", "' + getSecondUserID[0].user_id + '")');
            await common.getData("INSERT INTO SocialMedia.user_followees (user_followee_id, current_user_id) VALUES (" + '"' + getSecondUserID[0].user_id + '", "' + getUserID[0].user_id + '")');
        }
}

async function deleteAccount() {
    const rows = await common.getData('SELECT * FROM SocialMedia.users ORDER BY user_name');
        
    if (rows.length != 0) {
        const username = await listUsers();
    
        const getUserID = await common.getData('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + username + '"');
        
        await common.getData('DELETE FROM SocialMedia.users WHERE user_id = ' + '"' + getUserID[0].user_id + '" AND user_name = ' + '"' + option + '"');
    } else {
        console.log("you need to insert some users!")
    }
    
}

async function likeTweet() {
    const username = await listUsers("Enter a username to get a list of their tweets");
    const getUserID = await common.getData('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + username + '"');
    
    const userinfo = await common.getData('SELECT COUNT(original_user_id) AS user_likes FROM SocialMedia.user_likes WHERE original_user_id = ' + '"' + getUserID[0].user_id + '"');

    if (userinfo == undefined) {
        console.log("The user " + getUserID[0].user_name + ' has no tweets')
    } else {
        console.log(getUserID[0].user_id)
        const likeTweetPrompt = await listTweets("Enter the ID of the tweet you would like another user to like", getUserID[0].user_id);

        const selectAnotherUserPrompt = prompt("Enter another user name from the list above who you want to like the above tweet");

        const getSecondUserID = await common.getData("SELECT user_id FROM SocialMedia.users WHERE user_name = '" + selectAnotherUserPrompt + "'");

        const isTweetAlreadyLiked = await common.getData("SELECT * from SocialMedia.user_likes WHERE EXISTS(SELECT * FROM SocialMedia.user_likes WHERE tweet_id = " + "'" + likeTweetPrompt + "' AND user_id = " + "'" + selectAnotherUserPrompt + "')")

        if (isTweetAlreadyLiked.length != 0) {
            await common.getData("DELETE FROM SocialMedia.user_likes WHERE tweet_id = " + "'" + likeTweetPrompt + "'" + "AND user_id = " + "'" + getSecondUserID + "'");
        } else {
            console.log(getUserID)
            console.log(getSecondUserID[0].user_id)
            await common.getData("INSERT INTO SocialMedia.user_likes (tweet_id, user_id, original_user_id) VALUES (" + "'" + likeTweetPrompt + "', '" + getSecondUserID[0].user_id + "', '" + getUserID[0].user_id + "')");
        }
    }
}

async function blockUser() {
    const option = await listUsers("Enter the username of the user");

    const getUserID = await common.getData('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + option + '"');
    
    const whoWantsToBlockUser = prompt("Enter the username of the user wnats to block the above user");

    const whoWantsToBlockUserID = await common.getData('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + whoWantsToBlockUser + '"');

    const isUserAlreadyBlocked = await common.getData("SELECT * from SocialMedia.blocked_users WHERE EXISTS(SELECT * FROM SocialMedia.blocked_users WHERE blocked_user_id = " + "'" + whoWantsToBlockUserID + "' AND user_id = " + "'" + getUserID + "')")

    if (isUserAlreadyBlocked.length < 0) {
        await common.getData("INSERT INTO SocialMedia.blocked_users (blocked_user_id, user_id) VALUES (" + "'" + whoWantsToBlockUserID + "'", "'" + option + "'");
    } else {
        console.log("This user is already blocked. Do you want to unblock them? Type yes or no")
        const unblockUser = prompt("");

        if(unblockUser == "yes") {
            await common.getData("DELETE FROM SocialMedia.blocked_users WHERE blocked_user_id = " + "'" + whoWantsToBlockUserID + "'" + "AND user_id = " + "'" + option + "'");
        }

    }
}

module.exports = {deleteTweet, insertUsers, viewUser, insertTweets, followUser, deleteAccount, likeTweet, blockUser}