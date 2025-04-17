// Mock API functions for authentication
export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Demo credentials for testing
      if (email === "demo@example.com" && password === "password") {
        const userData = { id: "1", email, name: "Demo User" };
        resolve(userData);
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1500);
  });
};

export const mockRegister = (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // you would validate and create the user in your backend
      const userData = {
        id: Date.now().toString(),
        email,
        name: email.split("@")[0],
      };
      resolve(userData);
    }, 1500);
  });
};

export const mockResetPassword = (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1500);
  });
};
