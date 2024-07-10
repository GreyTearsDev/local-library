const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const AuthorSchema = new Schema({
  first_name: { type: String, reqired: true, maxLength: 100 },
  family_name: { type: String, reqired: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for getting author's full name
AuthorSchema.virtual("name").get(function () {
  // to handle cases where either first or family name is not provided,
  // we want to make sure to handle the exception by returning a string

  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for getting author's URL
AuthorSchema.virtual("url").get(function () {
  // we don't use an arrow function as we'll need the "this" object
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : "";
});

AuthorSchema.virtual("date_of_birth_formatted_input").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toFormat("yyyy-MM-dd")
    : "";
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : "";
});

AuthorSchema.virtual("date_of_death_formatted_input").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toFormat("yyyy-MM-dd")
    : "";
});

module.exports = mongoose.model("Author", AuthorSchema);
