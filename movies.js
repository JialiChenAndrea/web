const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
let { ObjectId } = require('mongodb');

module.exports = {
    async create(title, plot, rating, runtime, genre, cast, info) {
        if (title === undefined || plot === undefined || rating === undefined || runtime === undefined || genre === undefined || cast === undefined || info === undefined) {
            throw 'All fields need to have valid values';
        }
        if (typeof title != 'string' || typeof plot != 'string' || typeof rating != 'string' || typeof runtime != 'string' || typeof genre != 'string') {
            throw 'title, plot, rating, runtime, genre should be string';
        }
        if (title.length === 0 || plot.length === 0 || rating.length === 0 || runtime.length === 0 || genre.length === 0) {
            throw 'title, plot, rating, runtime, genre should be non-empty string';
        }
        //？FOR ALL INPUTS: Strings with empty spaces are NOT valid strings.  So no cases of "    " are valid. 
        if (/^\s*$/.test(title) || /^\s*$/.test(plot) || /^\s*$/.test(rating) || /^\s*$/.test(runtime) || /^\s*$/.test(genre)) {
            throw "Strings with empty spaces are NOT valid strings."
        }
        if (!Array.isArray(cast)) {
            throw "cast is not an array"
        }
        /*If cast is not an array and if it does not have at least one element in it that is a valid string, or are empty strings the method should throw.*/
        if (cast.length === 0) {
            throw "cast is an empty array"
        }
        flag = false
        cast.forEach(element => {
            if (typeof element == 'string' && element.length != 0 && !/^\s*$/.test(element)) {
                flag = true
            }
        });
        if (flag == false) {
            throw "cast does not have at least one element in it that is a valid string"
        }
        //If info is not an object, the method should throw.
        if (Array.isArray(info) || typeof info != 'object') {
            throw "info is not an object"
        }
        //If info.director is not a valid string or if info.director is not provided or is an empty string, the method should throw.
        if (info.director === undefined) {
            throw "info.director is undefined"
        }
        if (typeof info.director != 'string') {
            throw "info.director is not string"
        }
        if (info.director.length === 0) {
            throw "info.director is an empty string"
        }
        if (/^\s*$/.test(info.director)) {
            throw "strings with empty spaces are NOT valid strings."
        }
        //If info.yearReleased is not a 4 digit number or if info.yearReleased is not provided, the method should throw.
        if (info.yearReleased === undefined) {
            throw "info.yearReleased is not provided"
        }
        if (! /^[0-9]{4}$/.test(info.yearReleased)) {
            throw "info.yearReleased is not a 4 digit number"
        }
        //If info.yearReleased is less than 1930 or greater than the current year + 5 years, the method should throw. 
        if (info.yearReleased < 1930 || info.yearReleased > new Date().getFullYear() + 5) {
            throw "info.yearReleased is less than 1930 or greater than the current year + 5 years"
        }
        const movieCollection = await movies();
        let newMovie = {
            title: title,
            plot: plot,
            rating: rating,
            runtime: runtime,
            genre: genre,
            cast: cast,
            info: info
        };
        const insertInfo = await movieCollection.insertOne(newMovie);
        if (insertInfo.insertedCount === 0) {
            throw 'Could not add movie';
        }
        const newId = insertInfo.insertedId;

        let movie = await this.get(newId.toString());
        movie._id = movie._id.toString()
        return movie;
    },

    async get(id) {
        if (id === undefined) {
            throw 'You must provide an id to search for';
        }
        //If the id provided is not a string, or is an  empty string, the method should throw.
        if (typeof id != 'string') {
            throw "id is not a string"
        }
        if (id.length === 0) {
            throw "id is an empty string"
        }
        if (/^\s*$/.test(id)) {
            throw "strings with empty spaces are NOT valid strings."
        }
        //If the id  provided is not a valid ObjectId, the method should throw
        let parsedId = ObjectId(id);
        const movieCollection = await movies();
        let movie = await movieCollection.findOne({ _id: parsedId });
        if (movie === null) throw 'No movie with that id';
        movie._id = movie._id.toString()
        return movie;
    },
    async getAll() {
        const movieCollection = await movies();

        const movieList = await movieCollection.find({}).toArray();
        movieList.forEach(element => {
            element._id = element._id.toString()

        });
        return movieList;
    },
    async remove(id) {
        if (id === undefined) {
            throw 'You must provide an id to search for';
        }
        //If the id provided is not a string, or is an  empty string, the method should throw.
        if (typeof id != 'string') {
            throw "id is not a string"
        }
        if (id.length === 0) {
            throw "id is an empty string"
        }
        if (/^\s*$/.test(id)) {
            throw "strings with empty spaces are NOT valid strings."
        }
        //?If the id  provided is not a valid ObjectId, the method should throw
        let parsedId = ObjectId(id);

        const movieCollection = await movies();
        const movie = await movieCollection.findOne({ _id: parsedId });
        const deletionInfo = await movieCollection.deleteOne({ _id: parsedId });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete movie with id of ${id}`;
        }
        return movie.title + "has been successfully deleted"
    },
    async rename(id, newTitle) {
        if (id === undefined || newTitle === undefined) {
            throw 'You must provide an id and newTitle to search for';
        }
        //If the id provided is not a string, or is an  empty string, the method should throw.
        if (typeof id != 'string' || typeof newTitle != 'string') {
            throw "id or newtitle is not a string"
        }
        if (id.length === 0 || newTitle.length === 0) {
            throw "id or newtitle is an empty string"
        }
        if (/^\s*$/.test(id) || /^\s*$/.test(newTitle)) {
            throw "strings with empty spaces are NOT valid strings."
        }
        //If the id  provided is not a valid ObjectId, the method should throw
        let parsedId = ObjectId(id);


        const movieCollection = await movies();

        var updatedMovie = await movieCollection.findOne({ _id: parsedId });
        if(!updatedMovie){
            throw "The movie does not exist"
        }
        updatedMovie.title = newTitle

        const updatedInfo = await movieCollection.updateOne(
            { _id: parsedId },
            { $set: updatedMovie }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update movie successfully';
        }

        return await this.get(id);
    }

}
