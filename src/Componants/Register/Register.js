import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
} from "@material-ui/core";
import "./register.css";

import { Link, useNavigate } from "react-router-dom";




const Signup = () => {
  let navigate = useNavigate();

  const [state, setState] = useState("");


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = (user) => {
    console.log(user);
    axios
      .post("https://medicinetiming.onrender.com/api/auth/signup", user)
      .then(({ data }) => {
        // console.log(data);
        if (data.message === "registerd success") {
          navigate("/login")

        } else {
          reset({ name: "", email: "", password: "" });
          setState(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // console.log(user);
  };
  return (
    <section
      className="register"
      //   vector-feb-2021-84_generated.jpg
      style={{
        backgroundImage: "url('./images/medicine2.jpg')",
      }}
    >
      <div className="register-layer">
        <div className="content ">
          <div className="d-flex justify-content-center align-items-center ">



            <Box style={{ backgroundColor: "#FBFDFD", width: "100%", margin: "auto", padding: "70px" }} className="shadow"  >
              <form onSubmit={handleSubmit(onSubmit)} >
                <Grid container spacing={2} direction="column" >
                  <Grid item>
                    <Typography variant="h4" style={{ color: "#009CB2" }} className="text-center">Register Form</Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Name"
                      fullWidth
                      InputLabelProps={{
                        style: { color: "#009CB2" },
                      }}

                      {...register("name", { required: true, pattern: /^[A-Z][a-z]{3,8}$/ })}
                      error={errors.name ? true : false}
                      helperText={errors.name ? errors.name.type === "required" ? "Name is required" : "your Name must start capital then from 3-8 character" : ""}

                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Email"
                      fullWidth
                      InputLabelProps={{
                        style: { color: "#009CB2" },
                      }}
                      InputProps={{
                        style: { borderBottomColor: "#009CB2" },
                      }}
                      {...register("email", {
                        required: true,
                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      })}
                      error={errors.email ? true : false}
                      helperText={
                        errors.email
                          ? errors.email.type === "required"
                            ? "Email is required"
                            : "Invalid email address"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Password"
                      type="password"
                      fullWidth
                      InputLabelProps={{
                        style: { color: "#009CB2" },
                      }}
                      {...register("password", { required: true, pattern: /^[A-Z][a-z0-9]{3,8}$/ })}
                      error={errors.password ? true : false}
                      helperText={
                        errors.password
                          ? errors.password.type === "required"
                            ? "Password is required"
                            : "password required must start capital and 3-8 any character from(a-z or 0-9)"
                          : ""
                      }
                    />
                  </Grid>
                  <div className="text-danger text-center">
                    {{ state } ? <h6>{state}</h6> : ""}
                  </div>
                  <p className="m-2 text-center">Have an Account? <Link to='/login' style={{ color: "#009CB2" }}>Login</Link></p>
                  <Grid item>
                    <Box className="d-flex justify-content-center">
                      <Button variant="contained" type="submit" style={{ backgroundColor: "#009CB2", color: "white" }} className="mt-1">
                        Register
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </div>
        </div>


      </div>

    </section>
  );
};

export default Signup;
