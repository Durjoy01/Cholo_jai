import Train from "../models/train.models.js";

export const searchTickets = async (req, res) => {
  const { from, to, date, type } = req.query;

  try {
    const searchDate = new Date(date);
    const trains = await Train.find({ date: searchDate });

    const results = trains
      .map((train) => {
        const fromStationIndex = train.routes.findIndex(
          (route) => route.station === from
        );
        const toStationIndex = train.routes.findIndex(
          (route) => route.station === to
        );

        if (
          fromStationIndex !== -1 &&
          toStationIndex !== -1 &&
          fromStationIndex < toStationIndex
        ) {
          const availableSeats = train.boggies
            .filter((boggy) => boggy.type === type)
            .reduce((total, boggy) => total + boggy.availableSeatsCount, 0);

          const totalDuration = train.routes
            .slice(fromStationIndex + 1, toStationIndex + 1)
            .reduce((total, route) => {
              const durationParts = route.durationFromPrevious.split(":");
              const hours = parseInt(durationParts[0], 10) || 0;
              const minutes =
                parseInt(durationParts[1].replace("h", ""), 10) || 0;
              const totalMinutes = hours * 60 + minutes;
              return total + totalMinutes;
            }, 0);

          let ticketPrice;
          if (type === "AC_CHAIR") {
            ticketPrice = Math.round(totalDuration * 1.8);
          } else if (type === "S_CHAIR") {
            ticketPrice = Math.round(totalDuration * 1.1);
          } else if (type === "SHOVAN") {
            ticketPrice = Math.round(totalDuration * 0.9);
          } else if (type === "SNIGDHA" || type === "AC_B" || type === "AC_S") {
            ticketPrice = Math.round(totalDuration * 2.5);
          } else if (type === "F_BERTH") {
            ticketPrice = Math.round(totalDuration * 2.3);
          } else if (type === "F_SEAT") {
            ticketPrice = Math.round(totalDuration * 2);
          } else {
            ticketPrice = 0;
          }

          return {
            from,
            to,
            searchDate,
            trainName: train.trainName,
            trainNumber: train.trainCode,
            totalDuration,
            availableSeats,
            boggyType: type,
            ticketPrice,
          };
        }
        return null;
      })
      .filter((result) => result !== null);

    if (results.length === 0) {
      res.status(404).json({ message: "No train found." });
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    console.error("Error searching for tickets:", error);
    res.status(500).json({
      message: "Error searching for tickets",
      error: error.message,
    });
  }
};
