const PlaceCard=(props)=>{
    return (       
      <div className="place-card">
      <div className="img-box">
        <img src={props.image}/>
      </div>
      <div className="place-desc">
        <span>{props.title}</span>
        <p style={{fontSize:"x-small"}}>{props.location}</p>
        <p style={{fontSize:"xx-small",color:"blue"}}>{props.category}</p>
      </div>
      <div className="view-more-container">
        <button>View More</button>
      </div>
    </div>)
}
export default PlaceCard