class apiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  paginate(documentsCount) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const pageEndIndex = page * limit //2 *10 then the end index of page 2 is 20 

    //paginateign reuslts
     const pagination = {}
     pagination.currentPage = page
     pagination.limit = limit
     pagination.numberOfpages = Math.ceil( documentsCount/limit)

     //next page logic 
     if(pageEndIndex<documentsCount){//if true this mean there is more data 
      pagination.next = page+1
    }
    //previous page logic 
     if(skip>0){
      pagination.previous = page-1
     }


    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)
    this.paginationResult = pagination
    return this
  }

  filter() {
    //1-A)filtering
    // eslint-disable-next-line prefer-object-spread
    const queryStringObject = Object.assign({}, this.queryString);
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"]; //any field related to api features
    excludesFields.forEach((field) => delete queryStringObject[field]);

    //1-B)advanced filtering
    let queryStr = JSON.stringify(queryStringObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this; //to chain another methods
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  search(ModleName) {
    if (this.queryString.keyword) {
      const query = {};
      if(ModleName ==="Products"){
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      }else{
        query.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
        ];

      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }
}


module.exports = apiFeatures