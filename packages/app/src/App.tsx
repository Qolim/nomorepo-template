import React from "react";
import { getDate } from "app-util";
import { Button } from "app-ui";
import "./App.css";

export default function App(): JSX.Element {
  const date = getDate();
  return <Button className="app-button">{date}</Button>;
}
