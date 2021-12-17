import React from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col, Image} from "react-bootstrap";

function Gallery() {
  
  const getImages = () => {
    let images = [];

    for (let i = 1; i <= 7; i++){
      images.push(
        <Image
          style={{width: 'inherit', margin: '10px'}}
          src={"Gallery/image" + i + ".png"}
          rounded
        />
      );
    }

    return images;
  }

  return (
      <>
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'2.5%'}}>
              <Col style={{textAlign: "center",}}>
                  <Row style={{fontFamily: 'factoria,serif'}}> 
                      <div className="headerTitle">
                          <h1>Gallery</h1>
                      </div>

                      <div>
                          <h5>Here is some of our work:</h5>
                      </div>

                      {getImages()}
                  </Row>
              </Col> 
          </div>            
      </>
  );
}
export default Gallery;