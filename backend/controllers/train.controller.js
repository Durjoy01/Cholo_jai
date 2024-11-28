import Train from '../models/train.models.js';

export const addTrain = async (req, res) => {
  try {

    const {
      trainName,
      trainCode,
      date,
      day,
      runsOn,
      offDay,
      routes,
      boggies,
      totalDuration
    } = req.body;

    if( day === offDay ) {
      return res.status(400).json({
        message: "Off day can't be same as running day"
      });
    }

    const newTrain = new Train({
      trainName,
      trainCode,
      date,
      day,
      runsOn,
      offDay,
      routes,
      boggies,
      totalDuration
    });

    const savedTrain = await newTrain.save();

    res.status(201).json({
      message: "Train added successfully",
      train: savedTrain
    });
  } catch (error) {
    console.error("Error adding train:", error);
    res.status(500).json({
      message: "Error adding train",
      error: error.message
    });
  }
};

export const viewRoute = async (req, res) => {
  const { trainCode } = req.query;
  // console.log("Searching for train:", trainCode);
  try {
    const train = await Train.findOne(
      { trainCode },
      'trainName trainCode runsOn offDay routes'
    );
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }
    res.json(train);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

