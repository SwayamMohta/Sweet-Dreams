document.getElementById("entriesForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get the form data
    const title = document.getElementById("title").value;
    const prompt = document.getElementById("prompt").value;
    const entry = document.getElementById("entry").value;

    // Prepare the request data
    const requestData = {
        title: title,
        story: entry, 
        prompt: prompt 
    };

    try {
        // Send the data to the server
        const response = await fetch('http://localhost:3000/complete-story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        // Get the response from the server (completed story)
        const data = await response.json();

        // Check if the response is successful
        if (data.success) {
            // Display the completed story in the modal
            document.getElementById("outputMessage").innerHTML = `
                <strong>Completed Story:</strong><br><br>
                ${data.completedStory}
            `;
        } else {
            document.getElementById("outputMessage").innerHTML = "Something went wrong. Please try again.";
        }

        // Display the modal
        document.getElementById('outputModal').style.display = 'block';

    } catch (error) {
        console.error("Error submitting form: ", error);
        document.getElementById("outputMessage").innerHTML = "Error while connecting to the server.";
        document.getElementById('outputModal').style.display = 'block';
    }
});

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('outputModal').style.display = "none";
});

fetch('http://localhost:5000/api/entries')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch entries');
    }
    return response.json();
  })
  .then((data) => {
    console.log(data); // Check if the data is correct
    // Render the entries here
  })
  .catch((error) => {
    console.error('Error:', error);
  });
