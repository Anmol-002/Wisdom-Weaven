class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // query is of form keyword:value
  // we are using search for searching based on keyword jha bhi voh keyword hai find and return
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", //mtlb Abcd =abcd capital small ko same krna
          },
        }
      : {};
    // console.log(keyword);
    // jese yha this.query=Product.find() we sent in function call
    this.query = this.query.find({ ...keyword });
    return this;
  }
  // we would be using filter to filter based on a particular category
  filter() {
    const queryCopy = { ...this.queryStr }; //we are making a copy of str we cant directly write this.querystr because it would be passed by reference aur kuch change in querycopy would be reflected in original
    // console.log(queryCopy);

    const removeFields = ["keyword", "page", "limit"]; // if these elements are present remove them from query each request is handled seprately
    removeFields.forEach((key) => delete queryCopy[key]);

    // console.log(queryCopy);
    // now if we use this for filtering the price range too it doesnt give us any answer it needs a perfect number matching database
    // so we are creating a range. This filter section is case sensitive par hum frontend me dropdown me options denge toh chinta nhi hai
    // we will make frontend according to our ranges. Moreover jo bhi mongodb ke functions hote hai they have $sign in front for using value
    // greater than gt lt lte gte we need to add $ manually so we will first convert our object to string add $ via function replace jiska format
    // hota hai well defined anything between the brackets sabme replace vali value apply hoti hai

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    // console.log(queryStr);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage){
    const currentPage=Number(this.queryStr.page)|| 1

    const skip=resultPerPage* (currentPage-1) //konse number se dikhana hai

    this.query=this.query.limit(resultPerPage).skip(skip); //kitnde product dikhenge aur skip me starting ke utne skip honge 
    // ab agr tum get krke dekho sare element toh page 1 pe bas 5 hi dekhenge jo humne resultperpage ki val di hai agle 5 6-10 ke liye page 2 and so on..
    return this
  }
}
module.exports = ApiFeatures;
