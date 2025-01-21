import { useData } from "vike-react/useData";
import Comic from "../../../components/Comic";

function Page() {
  const data = useData();
  return(
    <Comic comic={data.comic}/>
  )
}

export default Page;