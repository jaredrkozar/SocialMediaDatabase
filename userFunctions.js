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
    '2022-04-22'
];
}

async function deleteTweet() {
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
}

async function insertUsers() {
    console.log("Inserting 30 random users into the database...")

    const newUsers = [];

    for(let i = 0; i<30;i++) {
        newUsers.push(createNewUser());
    }

    var insertQuery = "INSERT INTO SocialMedia.users (user_firstName, user_lastName, user_name, user_password, user_avatar, bioText, mobilePhone, registerDate) VALUES ?";
    
    connection.query(insertQuery, [newUsers], (err, res) => {
        console.log("REsult", res);
        console.log("Error", err);
    });
}

async function viewUser() {
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

    const numFollowers = await init('SELECT COUNT(current_user_id) AS num_followers FROM SocialMedia.user_followers WHERE current_user_id = ' + '"' + userinfo[0].user_id + '"');

    console.log('The user is following ' + numFollowers[0].num_followers + ' users ');

    const numFollowees = await init('SELECT COUNT(user_follower_id) AS num_followees FROM SocialMedia.user_followers WHERE user_follower_id = ' + '"' + userinfo[0].user_id + '"');

    console.log('The user has ' + numFollowees[0].num_followees + ' followers ');
}

async function insertTweets() {

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

    var insertTweetSQL = "INSERT INTO SocialMedia.user_tweets (tweet_text, date_posted, user_id) VALUES ?";

    const getuserName = await init('SELECT user_name FROM SocialMedia.users WHERE user_id = ' + '"' + personID[0].user_id + '"');

    console.log('Inserting 30 random tweets into ' + getuserName + 'account')
    connection.query(insertTweetSQL, [fakeTweets], (err, res) => {
        console.log(err, res);
    });
}

async function followUser() {
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
}

async function deleteAccount() {
    const rows = await init('SELECT * FROM SocialMedia.users ORDER BY user_name');
        
    for(let i = 0; i<rows.length;i++) {
        console.log(rows[i].user_name);
    }

    const option = prompt("Enter the username of the user whose tweet you want to delete");

    const getUserID = await init('SELECT user_id FROM SocialMedia.users WHERE user_name = ' + '"' + option + '"');
    
    await init('DELETE FROM SocialMedia.users WHERE user_id = ' + '"' + getUserID[0].user_id + '" AND user_name = ' + '"' + option + '"');
}

module.exports = {deleteTweet, insertUsers, viewUser, insertTweets, followUser, deleteAccount}