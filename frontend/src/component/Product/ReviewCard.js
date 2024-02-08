import React from 'react'
import { Rating } from "@material-ui/lab";
import profilePng from "../../images/Profile.png"

const ReviewCard = (review) => {
    
    const options ={
        value: review.review.rating,
        readOnly: true,
        precision: 0.5,
    };

    
  return (
    <div className='reviewCard'>
        <img src={profilePng} alt="User"/>
        <p>{review.review.name}</p>
        <Rating {...options} />
        <span className="reviewCardComment">{review.review.comment}</span>
    </div>
  )
}

export default ReviewCard