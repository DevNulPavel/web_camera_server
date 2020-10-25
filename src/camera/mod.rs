// https://doc.rust-lang.org/reference/conditional-compilation.html

mod error;
mod camera_raspberry;


pub use self::{
    error::{
        CameraImageError
    }
};
pub use self::{
    camera_raspberry::{
        get_camera_image
    }
};