use std::{
    path::{
        PathBuf,
        Path
    },
    process::{
        Command
    }
};
use log::{
    debug,
    error
};
use super::{
    error::{
        CameraImageError
    }
};

fn get_util_full_path(path: &Path) -> Result<PathBuf, CameraImageError>{
    let path_str = path
        .as_os_str()
        .to_str()
        .ok_or_else(||{
            CameraImageError::InvalidUtilPath
        })?;
    Command::new("which")
        .arg(path_str)
        .output()
        .map_err(|e|{
            CameraImageError::WhichCallFailed(e)
        })
        .and_then(|which_command|{
            if which_command.status.success(){
                let res = std::str::from_utf8(&which_command.stdout)
                    .map_err(|_|{
                        CameraImageError::ApplicationNotFound
                    })
                    .map(|text|{
                        PathBuf::from(text.trim_end())
                    })?;
                Ok(res)
            }else{
                Err(CameraImageError::ApplicationNotFound)
            }
        })
}

pub fn get_camera_image(shutter_time: u16, iso: u16, exposition_correction: i16) -> Result<Vec<u8>, CameraImageError>{
    // https://github.com/DevNulPavel/Hardware/blob/master/RaspberryPi/RedirectServerSrc/redirect.go
    // raspistill -vf -hf -ss %d -ISO %d -awb auto -ex auto -ev %d -drc high -o -

    let raspistill_path = get_util_full_path(&Path::new("raspistill"))?;

    debug!("Raspistill path: {:?}", raspistill_path);

    // TODO: Suppress out
    Command::new(raspistill_path)
        .args(&["-vf", 
                "-hf", 
                "-ss", format!("{}", shutter_time).as_str(),
                "-ISO", format!("{}", iso).as_str(),
                "-awb", "auto", 
                "-ex", "auto",
                "-ev", format!("{}", exposition_correction).as_str(), 
                "-drc", "high",
                "-o", "-"])
        .spawn()
        .map_err(|e|{
            CameraImageError::CameraStartFailed(e)
        })?
        .wait_with_output()
        .map_err(|e|{
            error!("FFmpeg capture filed: {}", e);
            CameraImageError::CameraCaptureFailed(e)
        })
        .and_then(|output|{
            if output.status.success() {
                Ok(output.stdout)
            }else{
                Err(CameraImageError::CameraOutputError)
            }
        })
}