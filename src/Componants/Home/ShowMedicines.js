import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "../Form";
import "./Home.css";

const ShowMedicines = (props) => {
  const [state, setState] = useState("");
  const [updateMedicine, setUpdateMedicine] = useState(null);

  const [Medicines, setAllMedicines] = useState([]);
  const [timeValue, setTimeValue] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setState("")
  };
  const handleShow = (medicine) => {
    setUpdateMedicine(medicine);
    setShow(true);
  };

  const [noData, setNoData] = useState("");
  const handleTimeChange = (event) => {
    // Update the timeValue state with the new value of the time field
    setTimeValue(new Date(event.target.value));
  };
  useEffect(() => {
    if (Object.keys(props.newMedicine).length > 0) {
      console.log(props.newMedicine);
      setAllMedicines((prevMedicines) => [...prevMedicines, props.newMedicine]);
    }
  }, [props.newMedicine]);
  useEffect(() => {
  if (props.reload) {
  getAllMedicine();
    }
  }, [props.reload]);
  const getAllMedicine = () => {
    axios
      .get("https://medicinetimingbeckend.onrender.com/api/medicine/allMedicine", {
        headers: {
          authorization: "Bearer " + localStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        console.log(res.data.allMdicines);
        if (res.data.allMdicines.length > 0) {
          setAllMedicines(res.data.allMdicines);
        } else {
          setNoData("No Added Medicine Yet !!!!!!!");
        }
        // console.log(res.data.allMdicine)
      });
  };

  useEffect(() => {
    getAllMedicine();
  }, []);
  //   console.log(Medicines);
  let deleteOne = (id) => {
    console.log(id);
    axios
      .delete(`https://medicinetimingbeckend.onrender.com/api/medicine/deleteMedicine/${id}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        console.log(res);
        setAllMedicines((oldData) => {
          return oldData.filter((Medicine) => {
            return Medicine._id !== id;
          });
        });
      });
  };
  const onSubmit = (callback) => {
    return (medicine) => {
      callback();

      // Convert the time value to UTC string before submitting the form
      medicine.time = timeValue.toUTCString();

      // Do something with the data, e.g. send it to the server
      console.log(medicine);
      console.log(updateMedicine);
      axios
        .put(
          `https://medicinetimingbeckend.onrender.com/api/medicine/updateMedicine/${updateMedicine._id}`,
          medicine,
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("userToken"),
            },
          }
        )
        .then((data) => {
          console.log(data);
          if (data) {
            // Update the list of all medicines with the updated medicine
            setAllMedicines((oldMedicines) => {
              return oldMedicines.map((oldMedicine) => {
                if (oldMedicine._id === updateMedicine._id) {
                  console.log(oldMedicine._id === updateMedicine._id);
                  return { ...oldMedicine, ...medicine };
                } else {
                  return oldMedicine;
                }
              });
            });

            handleClose();
          } else {
            setState(data.message);
          }
        })
        .catch((error) => {
          console.log(error);
          callback();
        });
    };
  };

  if (Medicines.length > 0) {
    return (
      <>
        <div style={{ backgroundColor: "#b0d9dd" }}>
          <div className="container">
            <h2 className="py-3 pl-3  text-center" style={{ color: "#009CB2" }}>
              All Medicine
            </h2>
            <div className="row">
              {Medicines.map((medicine) => (
                <div className="col-md-6" key={medicine._id}>
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: "20px",
                      padding: "20px ",
                      marginBottom: "10px",
                    }}
                  >
                    <div className="d-flex justify-content-end">
                      <Dropdown>
                        <Dropdown.Toggle
                          id="dropdownMenuLink"
                          variant="link"
                          className="text-dark"
                        >
                          {/* <i className="fas fa-ellipsis-v float-right"></i> */}
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ backgroundColor: "#009CB2" }}>
                          <Dropdown.Item>
                            <div
                              onClick={() => {
                                handleShow(medicine);
                              }}
                            >
                              <i className="far fa-edit  pt-1 text-warning pr-2"></i>
                              <span style={{ color: "white" }}>Edit</span>
                            </div>
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <div
                              onClick={() => {
                                deleteOne(medicine._id);
                              }}
                            >
                              <i className="fas fa-trash float-right pt-1 pr-2 text-danger"></i>
                              <span style={{ color: "white" }}>Delete</span>
                            </div>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    <div className="d-flex justify-content-between">
                      <div>
                        <h3>
                          {" "}
                          Medicine :{" "}
                          <span style={{ color: "#009CB2" }}>
                            {" "}
                            {medicine.name} For {medicine.duration} days
                          </span>
                        </h3>
                      </div>
                      {medicine.duration === 0 ? (
                        <div >
                          <i className="fa-solid fa-check" style={{ color: "#009CB2" ,fontSize:"25px" }}></i> <span style={{ color: "#009CB2" ,fontSize:"20px"}}>Token</span> 
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <h3>
                      {" "}
                      Dosage :{" "}
                      <span style={{ color: "#009CB2" }}>
                        {" "}
                        {medicine.dosage}{" "}
                      </span>{" "}
                    </h3>
                    <h3>
                      {" "}
                      Time :{" "}
                      <span style={{ color: "#009CB2" }}>
                        {" "}
                        {new Date(medicine.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                      </span>{" "}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Modal show={show} onHide={handleClose}>
          {/* <Modal.Header closeButton>
        </Modal.Header> */}
          <Modal.Body>
            <h3 className="text-center" style={{ color: "#009CB2" }}>
              Update Medicine
            </h3>

            <Form
              onSubmit={onSubmit}
              updateMedicine={updateMedicine}
              handleTimeChange={handleTimeChange}
              state={state}
              handleClose={handleClose}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
};

export default ShowMedicines;
