import { Outlet } from "react-router-dom";
import PageHeader from "../src/components/PageHeader/PageHeader";
import routes from "../src/router/routes";

const Root = () => {
  return (
    <>
      <PageHeader routes={routes()} />
      <Outlet />
    </>
  );
};

export default Root;
