use std::{
    io::{
        self
    }
};

#[derive(Debug)]
#[allow(dead_code)]
pub enum CameraImageError {
    WhichCallFailed(io::Error),
    InvalidUtilPath,
    ApplicationNotFound,
    TempFilePathError,
    CameraStartFailed(io::Error),
    CameraCaptureFailed(io::Error),
    CameraOutputError(String),
    TempFileReadError(io::Error),
    CameraFileNotFound(String),
}

// TODO:
// impl std::fmt::Display for CameraImageError{
//     fn display
// }

/*impl From<io::Error> for CameraImageError {
    fn from(err: io::Error) -> Self {
        CameraImageError::DeviceNotFound(err)
    }
}*/