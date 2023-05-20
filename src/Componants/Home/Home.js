import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Modal from "react-bootstrap/Modal";
import "./Home.css";
import { useForm } from "react-hook-form";
import { TextField } from "@material-ui/core";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
import ShowMedicines from "./ShowMedicines";
import io from 'socket.io-client';
import Push from 'push.js';

const Home = (props) => {
  const [state, setState] = useState("");
  const[newMedicine,setNewMedicine]=useState({})

  const [timeValue, setTimeValue] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  useEffect(() => {
    // Request permission for notifications
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Create the Socket.IO connection and listen for 'notification' events
    const socket = io('https://medicinetimingbeckend.onrender.com');

    socket.on('medicineTimingNotification', (data) => {
      // Display the notification when received
      console.log(data.message);
      showNotification(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const showNotification = (message) => {
    // Check if Push.js is supported
    if (!Push.Permission.has()) {
      console.log('This browser does not support desktop notification');
      return;
    }

    // Check if the user has granted permission for notifications
    if (Push.Permission.get() === Push.Permission.GRANTED) {
      const options = {
        body: message,
        icon: './images/medicine.jpg',
        timeout: 5000, // Auto-close the notification after 4 seconds
        vibrate: [200, 100, 200], // Control the vibration pattern
      };

      Push.create('Medicines', options);
    }
  };
  // useEffect(() => {
  //   // Request permission for notifications
  //   if (Notification.permission !== 'granted') {
  //     Notification.requestPermission();
  //   }
  
  //   // Create the Socket.IO connection and listen for 'notification' events
  //   const socket = io('https://medicinetimingbeckend.onrender.com');
  
  //   socket.on('medicineTimingNotification', (data) => {
  //     // Display the notification when received
  //     console.log(data.message)
  //     showNotification(data.message);
  //   });
  
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
  // const showNotification = (message) => {
  //   // Check if the browser supports notifications
  //   if (!('Notification' in window)) {
  //     console.log('This browser does not support desktop notification');
  //     return;
  //   }
  
  //   // Check if the user has granted permission for notifications
  //   if (Notification.permission === 'granted') {
  //     const options = {
  //     body: message,
  //     icon: './images/medicine.jpg',
  //      vibrate: [200, 100, 200], // to control the vibration pattern
     
  //     };
  
  //     const notification = new Notification('Medicines', options);
  
  //     // Handle the user clicking on the notification
  //     // notification.onclick = () => {
  //     //   // Add your desired action when the user clicks on the notification
  //     // };
  //   }
  // };

  const handleTimeChange = (event) => {
    // Update the timeValue state with the new value of the time field
    setTimeValue(new Date(event.target.value));
  };
  const onSubmit = (medicine) => {
    // Convert the time value to UTC string before submitting the form
    medicine.time = timeValue.toUTCString();
    medicine.duration = +medicine.duration

    // Do something with the data, e.g. send it to the server
    console.log(medicine);
    setNewMedicine(medicine);
    axios
      .post("https://medicinetimingbeckend.onrender.com/api/medicine/addMedicine", medicine, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("userToken"),
        },
      })
      .then(({ data }) => {
        console.log(data);
        if (data.message === "medicine added") {
          reset({ name: "", dosage: "", time: "",duration:"" });
          handleClose();
        } else {
          reset({ name: "", dosage: "", time: "" ,duration:"" });
          setState(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <section
        className="register"
        //   vector-feb-2021-84_generated.jpg
        style={{
          backgroundImage: "url('./images/medicine2.jpg')",
        }}
      >
        <div className="Home-layer">


          <div className="row shadow med">
            <div className="col-md-6">
              <div>
                <img
                  style={{
                    borderTopRightRadius: "20px",
                    borderBottomLeftRadius: "20px",
                  }}
                  src="./images/medicine.jpg"
                  className="w-100"
                  alt="Medicine"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-end">
                <Dropdown>
                  <Dropdown.Toggle
                    id="dropdownMenuLink"
                    variant="link"
                    className="text-white"
                    style={{ fontSize: "30px" }}

                  >
                    {/* <i className="fas fa-ellipsis-v float-right"></i> */}
                  </Dropdown.Toggle>

                  <Dropdown.Menu >
                    <Dropdown.Item>
                      <div onClick={props.logout}>
                        <span style={{ color: "#009CB2" }} >Logout</span>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className=" d-flex justify-content-center align-items-center mt-3">
                <div>
                  <div className=" text-center" style={{ color: "#eeeff0" }}>
                    <h1> Hi {props.userDate?.name}..</h1>
                    <h2>Medicine Timing</h2>
                    <p className="m-75">
                      you can manage your medicine by add your medicine so
                      notification send in the time of the medicine
                    </p>
                    <Button
                      onClick={handleShow}
                      variant="contained"
                      style={{
                        backgroundColor: "rgb(13 209 227)",
                        color: "white",
                      }}
                      className="py-2 px-4 mb-3"
                    >
                      add medicine
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <ShowMedicines newMedicine={newMedicine}/>
      <Modal show={show} onHide={handleClose}>
        {/* <Modal.Header closeButton>
        </Modal.Header> */}
        <Modal.Body>
          <h3 className="text-center" style={{ color: "#009CB2" }}>
            Add Medicine
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="px-4">
            <TextField
              label="Name"
              fullWidth
              InputLabelProps={{
                style: { color: "#009CB2" },
              }}
              {...register("name", { required: true })}
              error={Boolean(errors.name)}
              helperText={errors.name ? "Name is required" : ""}
            />
            <br />
            <TextField
              label="Dosage"
              fullWidth
              InputLabelProps={{
                style: { color: "#009CB2" },
              }}
              {...register("dosage", { required: true })}
              error={Boolean(errors.dosage)}
              helperText={errors.dosage ? "Dosage is required" : ""}
            />
            <br />
            <div className="mt-3">
              <TextField
                label="Time"
                fullWidth
                type="datetime-local"
                {...register("time", { required: true })}
                error={Boolean(errors.time)}
                helperText={errors.time ? "Time is required" : ""}
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: "#009CB2",
                    marginTop: "8px",
                    fontSize: "20px",
                  },
                }}
                onChange={handleTimeChange}
              />
            </div>
            <TextField
                      label="Duration (in days)"
                      fullWidth
                      InputLabelProps={{
                        style: { color: "#009CB2" },
                      }}
                      {...register("duration", {
                        required: true,
                        pattern: /^\d*$/,
                      })}
                      error={errors.duration ? true : false}
                      helperText={
                        errors.duration
                          ? errors.duration.type === "required"
                            ? "duration is required"
                            : "Duration should be a number"
                          : ""
                      }
                    />
            <div>
              {state === "medicine added" ? (
                <h6 className="text-center">{state}</h6>
              ) : (
                <h6 className="text-danger text-center">{state}</h6>
              )}
            </div>
            <div className="d-flex justify-content-end mt-2">
              <div>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#009CB2", color: "white" }}
                  type="submit"
                  className="my-2 mx-2"
                >
                  Add Medicine
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClose}
                  className="my-2"
                >
                  close
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Home;
