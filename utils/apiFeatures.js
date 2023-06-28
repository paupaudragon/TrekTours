class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = { ...this.queryString }; //create a new object
      const excludeFields = ["page", "sort", "limit", "fields"]; //depends on developer's implementation
      excludeFields.forEach((el) => delete queryObj[el]);
  
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      this.query = this.query.find(JSON.parse(queryStr));
  
      //return the object so we can chain them up
      return this;
    }
  
    sort() {
      
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(",").join(" ");
  
        this.query = this.query.sort(sortBy);
      }
      //default sorting
      else {
        this.query = this.query.sort("-ratingsQuantity");
      }
  
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select("-__v"); //- means excluding
      }
      return this;
    }
  
    paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
  
      // skip x results ; x/items per page = # page skipped
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
  }

  module.exports = APIFeatures