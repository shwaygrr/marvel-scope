import React, { useEffect, useState, useRef } from "react";
import md5 from 'md5'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
  } from "chart.js";

import { Bar } from "react-chartjs-2";

import { Box, TextField, Button } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

//setup api key
const private_key = import.meta.env.VITE_PRIVATE_API_KEY;
const public_key = import.meta.env.VITE_PUBLIC_API_KEY

const ts = new Date().getTime().toString(); 

const hash = md5(ts + private_key + public_key); 

const key = `ts=${ts}&apikey=${public_key}&hash=${hash}`

//get current date
const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const day = String(date.getDate()).padStart(2, '0');

const currentDate = `${year}-${month}-${day}`;


export default function AppearanceChart({ character }) {
    const [appearData, setAppearData] = useState(null)
    const [startYear, setstartYear] = useState(2000)
    
    const textFieldRef = useRef(null);
    
    useEffect(() => {
        async function getComicsData() {
            const endDate = startYear+10 > year ? currentDate : `${startYear+10}-01-01` 
            const comicsQuery = `https://gateway.marvel.com:443/v1/public/characters/${character.id}/comics?dateRange=$${startYear}-01-01%2C${endDate}&limit=100&${key}`;
            try {
                const response = await fetch(comicsQuery);
                const comicsJson = await response.json()
                const comicsData = await comicsJson.data.results
                setAppearData(countAppear(comicsData));
                console.log(comicsData)
                // console.log(appearData)
            } catch (err) {
                console.log(err)
                return
            }
        }
        getComicsData();
    }, [character, startYear]);
    
    function countAppear(comics) {
        const appearDict = {};
        
        comics.forEach(data => {
            const year = data.dates[0].date.substr(0, 4);
            
            if (appearDict.hasOwnProperty(year)) {
                appearDict[year]++;
            } else {
                appearDict[year] = 1;
            }
        })
        return appearDict;
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: '#000', // Legend text color
                },
            },
            title: {
                display: true,
                text: character.name + "'s Comic Book Appearances " + startYear + "-" + (startYear+10 > year ? year : startYear+10),
                color: 'white', // Title text color
                font: {
                    weight: 'bold',
                    size: 30,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'white',
                    font: {
                        size: 20,
                        weight: 'bold',                    },
                },
                grid: {
                    color: 'white',
                },
            },
            y: {
                ticks: {
                    color: 'white',
                    font: {
                        size: 18,
                        weight: 'bold',
                    },
                },
                grid: {
                    color: 'white',
                },
            },
        },
        layout: {
            padding: 10,
            backgroundColor: '#fff',
        },
    };
    
    const data = {
        labels: appearData && Object.keys(appearData),
        datasets: [
          {
            data: appearData && Object.values(appearData),
            backgroundColor: "#EC1D24",
          },
        ],
    };

    function handleButtonClick() {
        const year = parseInt(textFieldRef.current.value);
    
        // Check if year is a valid number and within a reasonable range
        if (!isNaN(year) && year >= 1000 && year <= new Date().getFullYear()) {
            setstartYear(year);
        } else {
            console.log('Invalid input for year');
        }
    }
    return (
        appearData && 
        <Box sx={{ width: '80%', height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Box>
                <TextField
                    id="standard-multiline-flexible"
                    label="Year Since"
                    type="number"
                    variant="standard"
                    inputRef={textFieldRef} // Assign the ref to the TextField
                    sx={{
                        color: 'white',
                        '& .MuiInputLabel-root': {
                            color: 'white',
                            fontSize: '20px',
                        },
                        '& .MuiInputBase-root': {
                            color: 'white',
                        },
                        mr: 1, // Adjust margin-right for spacing between input and button
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleButtonClick}
                    sx={{
                        ml: 1, // Adjust margin-left for spacing between input and button
                    }}
                >
                    Enter Year
                </Button>
            </Box>
            <Bar options={options} data={data} style={{ zIndex: '1'}}/>
        </Box>
        
    )
}