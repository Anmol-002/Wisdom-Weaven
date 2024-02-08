import React, { Fragment, useEffect, useState } from 'react'
import "./Products.css"
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getProduct } from '../../actions/productActions'
import Loader from '../layout/Loader/Loader'
import ProductCard from '../Home/ProductCard'
import { useMatch } from "react-router-dom";
import Pagination from "react-js-pagination"
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";
import Slider from "@material-ui/core/Slider";
import { useAlert } from "react-alert";

const categories = [
  "Hand-knit-items",
  "Shawls",
  "Jewelry",
  "Cards",
  "Paintings",
  "Quilts/aprons",
];

const Products = () => {
  
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);

    const match = useMatch('/products/:keyword');
    const alert = useAlert();
    const dispatch = useDispatch()
    const {products,loading, error, productsCount, resultPerPage} = useSelector(state => state.products)

    let keyword;
    if (match && match.params) {
      keyword = match.params.keyword;
    }

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
      };
    
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
          }

        dispatch(getProduct( keyword, currentPage, price,category, ratings));
    }, [dispatch,keyword, currentPage,price,category, ratings, alert,error])
  
    return (
      <Fragment>
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <MetaData title="Products - ECOMMERCE" />
            
            <h2 className="productsHeading">PRODUCTS</h2>

            <div class="dropdown">
              <button class="dropbtn">Filters</button>
              <div class="dropdown-content">
                <div className="hehe">
                  <Typography style={{ paddingLeft: "23px" }}>
                    Price:
                  </Typography>
                  <Slider
                    value={price}
                    onChange={priceHandler}
                    //valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    min={0}
                    max={1500}
                    aria-label="Always visible"
                    defaultValue={1500}
                    step={10}
                    valueLabelDisplay="on"
                  />

                  <Typography>Categories</Typography>
                  <ul className="categoryBox">
                    {categories.map((category) => (
                      <li
                        className="category-link"
                        key={category}
                        onClick={() => setCategory(category)}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>

                  <fieldset>
                    <Typography component="legend">Ratings Above</Typography>
                    <Slider
                      value={ratings}
                      onChange={(e, newRating) => {
                        setRatings(newRating);
                      }}
                      aria-labelledby="continuous-slider"
                      valueLabelDisplay="auto"
                      min={0}
                      max={5}
                    />
                  </fieldset>
                </div>
              </div>
            </div>

            <div className="products">
              {products &&
                products.map((products) => (
                  <ProductCard key={products._id} product={products} />
                ))}
            </div>

            {/* <div className="filterBox">
                    <Typography>Price</Typography>
                        <Slider
                            value={price}
                            onChange={priceHandler}
                            //valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            min={0}
                            max={999999}
                            aria-label="Always visible"
                            defaultValue={999999}
        
                            step={10}
                            
                            valueLabelDisplay="on"
                        />
                    
                    <Typography>Categories</Typography>
                    <ul className="categoryBox">
                        {categories.map((category) => (
                            <li
                                className="category-link"
                                key={category}
                                onClick={() => setCategory(category)}
                            >
                            {category}
                            </li>
                        ))}
                    </ul>

                    <fieldset>
                    <Typography component="legend">Ratings Above</Typography>
                    <Slider
                        value={ratings}
                        onChange={(e, newRating) => {
                        setRatings(newRating);
                        }}
                        aria-labelledby="continuous-slider"
                        valueLabelDisplay="auto"
                        min={0}
                        max={5}
                    />
                    </fieldset>

                    </div> */}

            {resultPerPage < productsCount && (
              <div className="paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="1st"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              </div>
            )}
          </Fragment>
        )}
      </Fragment>
    );
}

export default Products