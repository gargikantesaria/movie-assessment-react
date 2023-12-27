import React, { useEffect } from "react"
import { Spinner } from "reactstrap";
import '../../../authentication/component/login/login.css';

const Spinners = ({ setLoading }) => {

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000000)
    }, [setLoading]);
    return (
        <React.Fragment>
            <Spinner color="light" className='me-2' size='sm'  />
        </React.Fragment>
    )
}

export default Spinners;