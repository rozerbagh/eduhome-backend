import express from "express";
import { createServer } from "http";
import { privateKey } from "../../config/privateKeys.js";
import morgan from "morgan";
import cors from "cors";
import os from "os";
// import { Socket } from "../../services/index.js";

const PORT = Number(privateKey.PORT) || 4010;
const appLoader = async (app, router) =>
  new Promise((resolve) => {
    const server = createServer(app);
    app.use(express.json());
    app.use("/uploads/", express.static("uploads/"));
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan("dev"));
    app.use(cors());
    app.use("/api/v1/", router);
    app.use("/getip", (req, res) => {
      const networkInterfaces = os.networkInterfaces();
      const arr = networkInterfaces["Local Area Connection 3"];
      const ip = arr[1].address;
      res.send({ ipdata: networkInterfaces, ip: ip });
    });
    app.use("/", (req, res) => {
      res.json({
        name: "Tuition Search Backend SERVICES",
        version: "1.0",
        data: { ...req.params },
      });
    });
    server.listen(PORT, () => {
      console.log(`App is running on port: ${PORT}`);
    });
    resolve();
  });

export { appLoader };
