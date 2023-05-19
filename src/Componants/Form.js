import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";




const Form = ({ onSubmit, updateMedicine, handleTimeChange, state, handleClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();


  return <form onSubmit={handleSubmit(onSubmit(() => reset({ name: "", dosage: "", time: "" })))} className="px-4">
    <TextField
      label="Name"
      fullWidth
      InputLabelProps={{
        style: { color: "#009CB2" },
      }}
      {...register("name", { required: true })}
      defaultValue={updateMedicine?.name}
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
      defaultValue={updateMedicine?.dosage}
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
                      defaultValue={updateMedicine?.duration}
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
      {state ? (
        <h6 className="text-danger text-center">{state}</h6>
      ) : (
        ""
      )}
    </div>
    <div className="d-flex justify-content-end">
      <div>
        <Button
          variant="contained"
          style={{ backgroundColor: "#009CB2", color: "white" }}
          type="submit"
          className="my-2 mx-2"
        >
          Update Medicine
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
  </form >
}

export default Form;