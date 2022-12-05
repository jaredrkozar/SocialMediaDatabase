const common = require("./commonFunctions");
const prompt = require("prompt-sync")();

async function deleteTweet() {
    const rows = await common.getData('SELECT * FROM SocialMedia.users ORDER BY user_name');
    console.log(rows.length)
    if (rows.length != 0) {
        for(let i = 0; i<rows.length; i++) {
            console.log(rows[i].user_name);
        }
    
        const option = prompt("Enter the username of the user whose info you would like to view");
    
        const getUserID = await common.getData('SELECT user_id, user_name FROM SocialMedia.users WHERE user_name = ' + '"' + option + '"');
        
        const userinfo = await common.getData('SELECT * FROM SocialMedia.user_tweets WHERE user_id = ' + '"' + getUserID[0].user_id + '"');
        if (userinfo.length == 0) {
            console.log("The user " + getUserID[0].user_name + ' has no tweets')
        } else {
            for(let i = 0; i<userinfo.length;i++) {
                console.log("ID " + userinfo[i].tweet_id);
                console.log("Text " + userinfo[i].tweet_text);
                console.log("Date Posted " + userinfo[i].date_posted);
                console.log("\n");
            }
        
            const deleteTweetPrompt = prompt("Enter the ID of the tweet you would like to delete");
        
            await common.getData('DELETE FROM SocialMedia.user_tweets WHERE user_id = ' + '"' + getUserID[0].user_id + '" AND tweet_id = ' + '"' + deleteTweetPrompt + '"');
        }
    } else {
        console.log("you need to add some users!")
    }
}

async function insertUsers() {
    console.log("Inserting 30 random users into the database...")
    console.log("type control-c on Mac to add users....not sure why this happens?????")
    const newUsers = [];

    const lastUser = await common.getData('SELECT user_id FROM SocialMedia.users ORDER BY user_id');

    const lastUserID = lastUser[lastUser.length - 1]

    for(let i = (lastUserID != undefined ? lastUserID : 0); i<30;i++) {
        newUsers.push(common.createNewUser());
    }

    var insertQuery = "INSERT INTO SocialMedia.users (user_firstName, user_lastName, user_name, user_password, user_avatar, bioText, mobilePhone, registerDate) VALUES ?";

    common.connection.query(insertQuery, [newUsers], (err, res) => {
        console.log(err, res);
        common.connection.end();
        console.log("ENDED")
    });
}

async function viewUser() {
    const rows = await common.getData('SELECT * FROM SocialMedia.users ORDER BY user_name');

    if(rows.length != 0) {
        for(let i = 0; i<rows.length;i++) {
            console.log(rows[i].user_name);
        }
    
        const option = prompt("Enter the username of the user whose info you would like to view");
    
        const userinfo = await common.getData('SELECT * FROM SocialMedia.users WHERE user_name = ' + '"' + option + '"');
    
        console.log("\n");
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
    
        const numFollowees = await common.getData('SELECT COUNT(user_follower_id) AS num_followees FROM SocialMedia.user_followers WHERE user_follower_id = ' + '"' + userinfo[0].user_id + '"');
    
        console.log('The user has ' + numFollowees[0].num_followees + ' followers ');
    } else {
        console.log("you need to hire some users!")
    }
}

async function insertTweets() {

    const rows = await common.getData('SELECT * FROM SocialMedia.users ORDER BY user_name');
        
    if (rows.length != 0) {
        const lastTweet = await common.getData('SELECT tweet_id FROM SocialMedia.user_tweets ORDER BY tweet_id');

        const lastTweetID = lastTweet[lastTweet.length - 1]
    
        for(let i = (lastTweetID != undefined ? lastTweetID : 0); i<rows.length;i++) {
            console.log(rows[i].user_name);
        }
    
        const option = prompt("Enter the username of the user whose tweets you want to generate");
    
        const personID = await common.getData('SELECT * FROM SocialMedia.users WHERE user_name = ' + '"' + option + '"');
        
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
    const rows = await common.getData('SELECT * FROM SocialMedia.users ORDER BY user_name');
        
        for(let i = 0; i<rows.length;i++) {
            console.log(rows[i].user_name);
        }

        const followFirstUser = prompt("Select an account");

        const getUserID = await common.getData('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + followFirstUser + '"');

        const followSecondUser = prompt("Select an account who you want " + followFirstUser + " to follow");

        const getSecondUserID = await common.getData('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + followSecondUser + '"');

        const isFollowing = await common.getData("SELECT * from SocialMedia.user_followers WHERE EXISTS(SELECT * FROM SocialMedia.user_followers WHERE user_follower_id = " + "'" + getUserID[0].user_id + "' AND current_user_id = " + "'" + getSecondUserID[0].user_id + "')")

        if(0 < isFollowing.length) {
            await common.getData('DELETE FROM SocialMedia.user_followers WHERE user_follower_id = ' + '"' + getUserID[0].user_id + '" AND current_user_id = ' + '"' + getSecondUserID[0].user_id + '"')
        } else {
            await common.getData("INSERT INTO SocialMedia.user_followers (user_follower_id, current_user_id) VALUES (" + '"' + getUserID[0].user_id + '", "' + getSecondUserID[0].user_id + '")');
        }
}

async function deleteAccount() {
    const rows = await common.getData('SELECT * FROM SocialMedia.users ORDER BY user_name');
        
    if (rows.length != 0) {
        for(let i = 0; i<rows.length;i++) {
            console.log(rows[i].user_name);
        }
    
        const option = prompt("Enter the username of the user whose tweet you want to delete");
    
        const getUserID = await common.getData('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + option + '"');
        
        await common.getData('DELETE FROM SocialMedia.users WHERE user_id = ' + '"' + getUserID[0].user_id + '" AND user_name = ' + '"' + option + '"');
    } else {
        console.log("you need to insert some users!")
    }
    
}

async function likeTweet() {
    const rows = await common.getData('SELECT * FROM SocialMedia.users ORDER BY user_name');
        
    if (rows.length != 0) {
        for(let i = 0; i<rows.length;i++) {
            console.log(rows[i].user_name);
        }
    }

    const option = prompt("Enter the username of the user whose tweet you want to like");

    const getUserID = await common.getData('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + option + '"');
    
    const userinfo = await common.getData('SELECT * FROM SocialMedia.user_tweets WHERE user_id = ' + '"' + getUserID[0].user_id + '"');
   
    if (userinfo.length == 0) {
        console.log("The user " + getUserID[0].user_name + ' has no tweets')
    } else {
        for(let i = 0; i<userinfo.length;i++) {
            console.log("ID " + userinfo[i].tweet_id);
            console.log("Text " + userinfo[i].tweet_text);
            console.log("Date Posted " + userinfo[i].date_posted);
            console.log("\n");
        }
    
        const likeTweetPrompt = prompt("Enter the ID of the tweet you would like another user to like");
    
        const selectAnotherUserPrompt = prompt("Enter another user name from the list above who you want to like the above tweet");

        const isTweetAlreadyLiked = await common.getData("SELECT * from SocialMedia.user_likes WHERE EXISTS(SELECT * FROM SocialMedia.user_likes WHERE tweet_id = " + "'" + likeTweetPrompt + "' AND user_id = " + "'" + selectAnotherUserPrompt + "')")

        if (isTweetAlreadyLiked.length == 0) {
            await common.getData("DELETE FROM SocialMedia.user_likes WHERE tweet_id = " + "'" + likeTweetPrompt + "'" + "AND user_id = " + "'" + selectAnotherUserPrompt + "'");
        } else {
            await common.getData("INSERT INTO SocialMedia.user_likes (tweet_id, user_id) VALUES (" + "'" + likeTweetPrompt + "'", "'" + selectAnotherUserPrompt + "'");
        }
    }
}

async function blockUser() {
    const rows = await common.getData('SELECT * FROM SocialMedia.users ORDER BY user_name');
        
    if (rows.length != 0) {
        for(let i = 0; i<rows.length;i++) {
            console.log(rows[i].user_name);
        }
    }

    const option = prompt("Enter the username of the user");

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