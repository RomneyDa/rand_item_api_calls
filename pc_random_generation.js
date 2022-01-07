import { server_url } from "./serverFunctions";

// RANDOM GENERATION OF RECORDS
const generate = {

    // Generate a random user and post it to the server
    user: async () => {
        // Get a random user from randomuser.me api
        const res = await fetch ('https://randomuser.me/api/?nat=us');
        const data = await res.json();
        const results = data.results[0];

        // Map output to user object for this app
        const { phone, name, email, location, registered, picture} = results;
        const {street, city, state, country, postcode, coordinates} = location
        const newUser = {
            phone: phone.replace(/\D/g,''),
            first_name: name.first,
            last_name: name.last,
            email,
            points: 1000,
            date_registered: registered.date,
            location: {
                address: `${street.number} ${street.name}, ${city}, ${state}, ${country} ${postcode}`,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            },
            img_url: picture.medium
        }

        //console.log(newUser);
        return newUser;
    },

    
    room: async () => {

        // Get a random party
        const response = await fetch(`${server_url}/parties`);
        const allParties = await response.json();
        const randomParty = getRandomArrayElements(allParties, 1)[0];

        // Get location of admin of party

        const response2 = await fetch(`${server_url}/users/${randomParty.admins[0].id}`)
        const admin = await response2.json();
        const location = admin.location;

        // Get 2 random events
        const response3 = await fetch(`${server_url}/events`);
        const allEvents = await response3.json();
        const randomEvents = getRandomArrayElements(allEvents, 2);

        // Create new room
        const newRoom = {
            party_id: randomParty.id,
            name: makeid(5),
            events: [],
            location,
            status: "open"
        }

        // Add random event ids
        randomEvents.forEach((event) => {
            newRoom.events.push({id: event.id})
        });

        //console.log(newRoom);
        return newRoom;
    },

    // Generate random party
    party: async () => {
        const response = await fetch(`${server_url}/users`);
        const allUsers = await response.json();

        const randomGroup = getRandomArrayElements(allUsers, 3);
        const admin = randomGroup[0];
        const members = randomGroup.slice(1);

        //console.log(admin);
        //console.log(members);

        // Create new party with random name
        const newParty = {
            admins: [],
            name: "Party " + makeid(5),
            users: [],
            private: true
        }

        // Add admin and member ids
        newParty.admins = [{id: admin.id}]
        members.forEach((user) => {
            newParty.users.push({id: user.id})
        });
        
        //console.log(newParty);
        return newParty;
    },

    // Generate random event
    event: async () => {
        const random_string = makeid(5);
        const newEvent = {
            name: "Event " + random_string,
            component_name: random_string
        }

        //console.log(newEvent);
        return newEvent;
    },

    // Generate random prize
    prize: async () => {
        const newPrize = {
            cost_points: getRandomPoints(),
            wholesale: getRandomUSD(),
            name: "Prize " + makeid(5),
            image_url: "https://picsum.photos/100"
        }
        //console.log(newPrize);
        return newPrize;
    },

    // Generate random item
    item: async () => {

        const newItem = {
            retail: getRandomUSD(),
            wholesale: getRandomUSD(),
            name: "Item " + makeid(5),
            points: getRandomPoints(),
            img_url: "https://picsum.photos/100"
        }
        //console.log(newItem);
        return newItem;
    },

    // Generate random order
    order: async () => {
        // Get random user
        const response = await fetch(`${server_url}/users`);
        const allUsers = await response.json();
        const randomUser = getRandomArrayElements(allUsers, 1)[0];

        // Get random item
        const response2 = await fetch(`${server_url}/items`);
        const allItems = await response2.json();
        const randomItem = getRandomArrayElements(allItems, 1)[0];

        // Generate random order
        const newOrder = {
            user_id: randomUser.id,
            item_id: randomItem.id,
            date: new Date(),
            retail: randomItem.retail,
            wholesale: randomItem.wholesale
        }

        //console.log(newOrder);
        return(newOrder);
    },

// Generate random redemption
    redemption: async () => {
        // Get random user
        const response = await fetch(`${server_url}/users`);
        const allUsers = await response.json();
        const randomUser = getRandomArrayElements(allUsers, 1)[0];

        // Get random item
        const response2 = await fetch(`${server_url}/prizes`);
        const allPrizes = await response2.json();
        const randomPrize = getRandomArrayElements(allPrizes, 1)[0];

        // Generate random order
        const newRedemption = {
            user_id: randomUser.id,
            prize_id: randomPrize.id,
            date: new Date(),
            cost_points: randomPrize.cost_points,
            wholesale: randomPrize.wholesale
        }

        //console.log(newRedemption);
        return newRedemption
    }
}

export default generate;

// SECONDARY FUNCTIONS

// returns an array of n number of random objects from an array of objects. Shuffles, then grabs the first n items
const getRandomArrayElements = (array, n) => {
    if(array.length <= n) return array;
    else return array.sort(() => 0.5 - Math.random()).slice(0, n);
}

// Generate random string of given length
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Generate random currency between 2 values
function getRandomNumber(min, max, decimalPlaces) {
    return (Math.random() * (max - min) + min).toFixed(decimalPlaces) * 1;
}

function getRandomPoints() {
    return getRandomNumber(1000, 20000, 0)
}

function getRandomUSD(){
    return getRandomNumber(10, 50, 2)
}