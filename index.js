
const connection = require('./config/mongoConnection');
const movies = require('./data/movies')
const main = async () => {

  //Create a movie of your choice.
  const firstMovie = await movies.create(
    "Bill and Ted Face the Music",
    "Once told they'd save the universe during a time-traveling adventure, 2 would-be rockers from San Dimas, California find themselves as middle-aged dads still trying to crank out a hit song and fulfill their destiny.",
    "PG-13",
    "1hr 31min",
    "Comedy",
    ["Keanu Reeves", "Alex Winter"],
    { director: "Dean Parisot", yearReleased: 2020 });

  //Log the newly created movie. (Just that movie, not all movies)
  console.log(firstMovie);


  //Create another movie of your choice.
  await movies.create(
    "Patrick and Ted Face the Music",
    "Once told they'd save the universe during a time-traveling adventure, 2 would-be rockers from San Dimas, California find themselves as middle-aged dads still trying to crank out a hit song and fulfill their destiny.",
    "PG-13", "1hr 31min", "Comedy",
    ["Keanu Reeves", "Alex Winter"],
    { director: "Dean Parisot", yearReleased: 2020 })


  // Query all movies, and log them all
  console.log(await movies.getAll())


  //  Create a 3rd movie of your choice.
  let thirdMovie = await movies.create("The Dark Knight",
    "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    "R",
    "2hr 32min",
    "Action",
    ["Christian Bale", "Heath Ledger"],
    { director: "Christopher Nolan", yearReleased: 2008 })

  //  Log the newly created 3rd movie. (Just that movie, not all movies)
  console.log(thirdMovie);

  //  Rename the first movie's title
  await movies.rename("5f75056cb751743af486be09", "Gone")


  //  Log the first movie with the updated title. 
  console.log(await movies.get("5f75056cb751743af486be09"))


  //  Remove the second movie you created.
  console.log(await movies.remove("5f75056cb751743af486be0a"))

  // Query all movies, and log them all
  console.log(await movies.getAll())





  //  Try to create a movie with bad input parameters to make sure it throws errors.
  await movies.create(
    "Bill and Ted Face the Music",
    "Once told they'd save the universe during a time-traveling adventure, 2 would-be rockers from San Dimas, California find themselves as middle-aged dads still trying to crank out a hit song and fulfill their destiny.",
    "PG-13",
    "1hr 31min",
    "Comedy",
    ["Keanu Reeves", "Alex Winter"],
    { director: "Dean Parisot", yearReleased: 1929 });

  //  Try to remove a movie that does not exist to make sure it throws errors.

  console.log(await movies.remove("5f74eb36c57ac45ba4b05ec2"))


  //  Try to rename a movie that does not exist to make sure it throws errors.
  await movies.rename("5f74eb36c57ac45ba4b05ec2", "gone")
  //  Try to rename a movie passing in invalid data for the parameter to make sure it throws errors.
  await movies.rename(123, 213)


  //  Try getting a movie by ID that does not exist to make sure it throws errors.

  await movies.get("5f74eb36c57ac45ba4b05ec2")

  const db = await connection();
  await db.serverConfig.close();

  console.log('Done!');



};

main().catch((error) => {
  console.log(error);
});
