import { useState, useEffect, useCallback } from "react";

export const useGet = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchData = useCallback(async () => {
      try {
        //fetch and add Authorization header
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (error) {
        //print the status code
        console.log(process.env)
        console.log(error);
        setError(error);
        setLoading(false);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);
  
    useEffect(() => {
      fetchData();
    }, [fetchData]);
  
    return { data, loading, error, fetchData };
};


export function usePost() {
    const [data, setData] = useState({});
    const [pending, setPending] = useState(null);
    const [error, setError] = useState(null);
    const [resMsg, setResMsg] = useState(null);
  
    const defaultHeaders = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    const handleSubmit = async ({
      e = "",
      url,
      body = data,
      headers = { ...defaultHeaders },
      dispatcher = null,
      dispatch = null,
    }) => {
      e && e.preventDefault();
  
      setPending(true);
      setError(null);
  
      try {
        const requestOptions = {
          method: "POST",
          headers: {
            ...headers,
            ...defaultHeaders,
            "Content-Type": body instanceof FormData ? "multipart/form-data" : "application/json",
          },
          body: body instanceof FormData ? body : JSON.stringify(body),
        };
  
        const res = await fetch(url, requestOptions);
  
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
  
        const json = await res.json();
  
        if (dispatcher !== null && dispatch !== null) {
          dispatcher(dispatch(json));
        } else {
          setResMsg(json);
        }
  
        setPending(false);
        setError(null);
      } catch (err) {
        console.log(err);
        setError(err.message);
        setPending(false);
      }
    };
  
    const handleChange = (e) => {
      e.persist();
      setData((data) => ({ ...data, [e.target.name]: e.target.value.trim() }));
    };
  
    return { data, handleSubmit, handleChange, pending, error, resMsg };
  }