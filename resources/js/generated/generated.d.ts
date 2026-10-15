declare namespace App {
namespace Data {
namespace Settings {
export type PasswordData = {
password: string,
};
export type ProfileData = {
name: string,
email: string,
};
}
namespace Site {
export type ImageData = {
src: string,
srcset: string,
width: number,
height: number,
alt: string,
focalX: number,
focalY: number,
};
}
}
}
