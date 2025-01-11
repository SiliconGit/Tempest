"use client";
import React, { useEffect, useState } from "react";

type FifthDivProps = {
  city: string;
};

interface ForecastData {
  day: string;
  icon: string;
  temp_max: number;
  temp_min: number;
  description: string;
}

const FifthDiv_W: React.FC<FifthDivProps> = ({ city }) => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getWeatherIcon = (icon: string): React.ReactNode => (
    <img
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt="Weather Icon"
      className="w-12 h-12"
    />
  );

  const fetchForecast = async (city: string): Promise<void> => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();
      setLoading(false);

      if (data.cod === "200") {
        const groupedData: ForecastData[] = [];
        const seenDays = new Set<string>();

        data.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const day = date.toLocaleDateString("en-US", { weekday: "long" });

          if (!seenDays.has(day)) {
            seenDays.add(day);
            groupedData.push({
              day,
              icon: item.weather[0].icon,
              temp_max: item.main.temp_max,
              temp_min: item.main.temp_min,
              description: item.weather[0].description,
            });
          }
        });

        setForecastData(groupedData.slice(0, 4)); // Limit to 4 days for 2x2 grid
        setError(null);
      } else {
        setError(data.message || "City not found.");
      }
    } catch (err) {
      setLoading(false);
      setError("Unable to fetch weather data. Please try again.");
    }
  };

  useEffect(() => {
    if (city) {
      fetchForecast(city);
    }
  }, [city]);

  const errorStyle = "text-center text-red-500 font-medium";

  if (loading) {
    return (
      <div
        className={`"bg-[#2E3440] text-[#D8DEE9] rounded-lg p-6 shadow-lg" animate-pulse`}
      >
        <div className="h-6 bg-[#4C566A] rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-6 bg-[#4C566A] rounded w-3/4 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#2E3440] text-[#D8DEE9] rounded-lg p-6 shadow-lg">
        <h1 className="font-semibold mb-6 text-center text-[#81A1C1] text-xl ">
          5-Day Forecast
        </h1>
        <p className={errorStyle}>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2E3440] text-[#D8DEE9] rounded-lg p-6 shadow-lg">
      <h1 className="lexend-400 text-[#81A1C1] text-xl mb-8 text-center">
        Day Forecast
      </h1>
      {forecastData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {forecastData.map((day, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-[#3B4252] rounded-lg shadow-lg"
            >
              <span className="font-medium text-center">{day.day}</span>
              <span className="flex justify-center">
                {getWeatherIcon(day.icon)}
              </span>
              <span className="text-center font-semibold">
                {day.temp_max.toFixed(1)}°C / {day.temp_min.toFixed(1)}°C
              </span>
              <span className="text-center text-sm text-[#88C0D0]">
                {day.description}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FifthDiv_W;
