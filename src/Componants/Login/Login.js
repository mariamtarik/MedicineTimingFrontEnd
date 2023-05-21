import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
} from "@material-ui/core";
import "../Register/register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";




const Login = (props) => {
  let navigate = useNavigate();
  const [state, setState] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = (user) => {
    axios
      .post("https://medicinetiming.onrender.com/api/auth/signin", user)
      .then(({ data }) => {
        console.log(data);
        if (data.message === "signin success") {
          localStorage.setItem("userToken", data.token)
          props.saveUserData()
          navigate("/app");
        } else {
          reset({ email: "", password: "" });
          setState(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
                    <Typography variant="h4" style={{ color: "#009CB2" }} className="text-center">Login Form</Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Email"
                      fullWidth
                      InputLabelProps={{
                        style: { color: "#009CB2" },
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
                  <p className="m-2 text-center"> Don't Have an Account? <Link to='/' style={{ color: "#009CB2" }}>Register</Link></p>
                  <Grid item>
                    <Box className="d-flex justify-content-center">
                      <Button variant="contained" type="submit" style={{ backgroundColor: "#009CB2", color: "white" }} className="mt-1 px-4 py-2">
                        Login
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

export default Login;



