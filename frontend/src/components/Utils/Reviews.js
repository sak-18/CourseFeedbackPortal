import React, { Component } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import axios from "axios";
import TimeAgo from "react-timeago";
import { get, groupBy, pick, sortBy } from "lodash";
import ButtonToolbar from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

import Container from "react-bootstrap/Container";
import Collapse from "react-bootstrap/Collapse";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Button from "react-bootstrap/Button";


import { getDecodedToken } from "../../utils/jwt";

class Reviews extends Component {
  constructor(props) {
    super(props);
    this.user = getDecodedToken();
    this.state = {
      reviews: null,
      courseid: props.courseid,
    };
  }
  dummy() {

  }

  async componentDidMount() {
    
    const reviews = (await axios.get("/routes/reviews/" + this.state.courseid))
      .data;
    this.setState({
      reviews,
    });
  }

  render() {
    return (
      <div className="container">
        <Link to={"/courses/" + this.state.courseid + "/add-review"}>
          <div className="card text-white bg-secondary mb-3">
            <div className="card-header mb-3 align-middle">
              {" "}
              Share Your Experience with this course
            </div>
            <div className="card-body">
              <h4 className="card-title">+ New Review</h4>
            </div>
          </div>
        </Link>
        
        <p> Sort By </p>
        <small className="text-muted">
          Default: Most recent last
        </small>
        <br/>
        
        {this.state.reviews ? (
          <ButtonToolbar style={{ marginBottom: "5px", marginLeft: "10px" }}>
            <ToggleButtonGroup
              type="radio"
              name="options"
              size="sm"
              defaultValue={4}
              onChange={value => {
                let reviews = [...this.state.reviews];
                let sortFunc = param => (a, b) => {
                  if (get(a, param) === get(b, param)) return 0;
                  return get(a, param) > get(b, param) ? -1 : 1;
                };
                reviews.sort(sortFunc("time"));
                switch (value) {
                  case 1: {
                    reviews.sort(sortFunc("time"));
                    break;
                  }
                  case 2: {
                    reviews.sort(sortFunc("upvotedby.length"));
                    break;
                  }
                  case 3: {
                    reviews.sort(sortFunc("rating"));
                    break;
                  }
                  
                  default: {
                    reviews.sort(sortFunc("time"));
                    break;
                  }
                }
                this.setState({ reviews: reviews });
              }}
            >
              <ToggleButton variant="outline-primary" value={1}>
                Most Recent
              </ToggleButton>
              <ToggleButton variant="outline-primary" value={2}>
                Most Upvoted
              </ToggleButton>
              <ToggleButton variant="outline-primary" value={3}>
                Rating
              </ToggleButton>
              
            </ToggleButtonGroup>
          </ButtonToolbar>
        ) : null}
        <div className="row">
          {this.state.reviews === null && <p>Looks Empty in here!</p>}
          {this.state.reviews &&
            this.state.reviews.map((review) => (
              <div key={review._id} className="col-sm-12 col-md-10 col-lg-12">
                <div className="card text-dark shadow p-4 mb-3 bg-light">
                  <div className="card-body">
                    <div key={review._id} className="container">
                      <Container>
                        <Row>
                        <Col lg={12}>
                          <div className="card text-dark  p-4 mb-3 bg-light">
                          <Row>
                          <Col
                              style={{
                                marginBottom: "auto",
                                marginTop: "auto",
                              }}
                            >
                              <Row>
                                <Col>
                                  <Button
                                    variant="success"
                                    size="lg"
                                    block
                                    disabled
                                  >
                                    {review.rating}
                                  </Button>
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={10}>
                              {/* <Row> 
                               <Col style={{ wordWrap: "break-word" }}> */}
                                <h3 className="card-title">{review.title}</h3>
                                <h4 className="card-text">{review.description}</h4>
                                <p>Submitted by {review.postedby}</p>
                                  <small className="text-muted">
                                    <TimeAgo date={review.time} />
                                  </small>
                                {/* </Col> 
                                 </Row> */}
                            </Col>
                          </Row>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <div class="col">
                          <small className="text-muted">
                                    <button
                                      className="info"
                                      onClick={() => {
                                        var url="/routes/reports/";
                                        axios.post(url, {
                                          contentType:"review",
                                          identifier:review._id,
                                          title:review.title,
                                          description: review.description,
                                          postedby: review.postedby,
                                          reportedby:this.user.name
                                        });
                                        window.confirm('Reported Successfully');
                                        this.props.history.push("/courses/" + this.props.courseid);
                                      }}
                                    >
                                      Report
                                    </button>
                                    </small>
                                  </div>
                              <div class="row">
                                  
                                  <div class="row right-content-end">
                                  <Col >
                                    <button
                                      className="btn btn-primary"
                                      onClick={() => {
                                        var url="/routes/reviews/upvote/"+String(review._id);
                                        axios.post(url, {
                                          email: this.user.email,
                                        });
                                        window.location.reload();
                                      }}
                                    >
                                      Upvote ({review.upvotedby.length})
                                    </button>
                                  </Col>
                                  <Col>
                                    <button
                                      className="btn btn-primary"
                                      onClick={() => {
                                        var url="/routes/reviews/downvote/"+String(review._id);
                                        axios.post(url, {
                                          email: this.user.email,
                                        });
                                        window.location.reload();
                                      }}
                                    >
                                      Downvote ({review.downvotedby.length})
                                    </button>
                                  </Col>
                                  </div>
                                  
                                </div>
                            </Row>
                          {/* </Col> */}
                        
                      </Container>
                    </div>

                    </div>
                  </div>
              </div>
              
            ))}
        </div>
      </div>
    );
  }
}

export default Reviews;
