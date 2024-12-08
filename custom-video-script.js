document.addEventListener("DOMContentLoaded", () => {
            let hiddenButtonSuccess;
          let hiddenButtonFailure;
            let buttons = document.getElementsByClassName("btn btn-secondary"); 
            console.log('buttons:'); 
            console.log(buttons); 
            for (let button of buttons) { 
                console.log(`Button text: "${button.textContent.trim()}"`); 
                // Check if the text content matches 
                if (button.textContent.trim() === "ga door naar de vragen") { 
                  hiddenButtonSuccess = button;
                }
              if (button.textContent.trim() === "je hebt niet de hele video bekeken, klik om te refreshen") { 
                  hiddenButtonFailure = button;
                }
            } 
          hiddenButtonSuccess.style.display = 'none';
          hiddenButtonFailure.style.display = 'none';

          let custom_video;
          const videos = document.querySelectorAll("video"); 
          for (let video of videos) { 
            if (video.hasAttribute("data-customvideo")) custom_video = video;
          }


          let playedRanges = []; // Array to store watched time ranges
  let lastTime = null;

  // Track time updates
  custom_video.addEventListener("timeupdate", () => {
    const currentTime = custom_video.currentTime;

    if (lastTime !== null) {
      const timeGap = currentTime - lastTime;

      // Only record time if the user has been playing without skipping
      if (timeGap > 0 && timeGap < 1) {
        playedRanges.push([lastTime, currentTime]);
      }
    }

    lastTime = currentTime;
  });

  // Listen for the 'ended' event to finalize the calculation
  custom_video.addEventListener("ended", () => {
    console.log("Video ended!");

    // Merge overlapping or adjacent time ranges
    const mergedRanges = mergeRanges(playedRanges);

    // Calculate the total time played
    const totalPlayedTime = calculateTotalPlayedTime(mergedRanges);

    console.log(`Total played time: ${totalPlayedTime} seconds`);

    // If the user played at least 90% of the video
    const videoDuration = custom_video.duration;
    if (totalPlayedTime >= videoDuration * 0.9) {
      console.log("User watched enough of the video!");
      hiddenButtonSuccess.style.display = 'block';
    } else {
      hiddenButtonFailure.style.display = 'block';
    }
  });

  // Utility: Merge overlapping or adjacent ranges
  function mergeRanges(ranges) {
    if (!ranges.length) return [];

    // Sort ranges by start time
    ranges.sort((a, b) => a[0] - b[0]);

    let merged = [ranges[0]];

    for (let i = 1; i < ranges.length; i++) {
      let lastRange = merged[merged.length - 1];
      let currentRange = ranges[i];

      // If ranges overlap or are adjacent, merge them
      if (currentRange[0] <= lastRange[1]) {
        lastRange[1] = Math.max(lastRange[1], currentRange[1]);
      } else {
        merged.push(currentRange);
      }
    }

    return merged;
  }

  // Utility: Calculate total played time
  function calculateTotalPlayedTime(ranges) {
    return ranges.reduce((total, range) => total + (range[1] - range[0]), 0);
  }
        });
