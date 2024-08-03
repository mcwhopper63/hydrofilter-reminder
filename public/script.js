import { addReminder, shareWithFriend } from './firebase.js';

const filterLifespans = {
    'pur-pitcher': 2,
    puro: 2,
    'zerowater-pitcher': 2,
    brita: 2,
    'pur-faucet': 3,
    'waterdrop-faucet': 3,
    'aquasana-undersink': 6,
    lifestraw: 3,
    berkey: 6,
};

function updateReplacementDate() {
    const selectedFilter = document.getElementById('filterType').value;
    const startDateInput = document.getElementById('startDate');
    const replacementDateInput = document.getElementById('replacementDate');

    if (
        selectedFilter &&
        filterLifespans[selectedFilter] &&
        startDateInput.value
    ) {
        const startDate = new Date(startDateInput.value);
        const replacementDate = new Date(startDate);
        replacementDate.setMonth(
            replacementDate.getMonth() + filterLifespans[selectedFilter]
        );
        replacementDateInput.value = replacementDate
            .toISOString()
            .split('T')[0];
    } else {
        replacementDateInput.value = '';
    }
}

document
    .getElementById('filterType')
    .addEventListener('change', updateReplacementDate);
document
    .getElementById('startDate')
    .addEventListener('change', updateReplacementDate);

document
    .getElementById('reminderForm')
    .addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const filterType = document.getElementById('filterType').value;
        const startDate = new Date(document.getElementById('startDate').value);
        const replacementDate = new Date(
            document.getElementById('replacementDate').value
        );

        try {
            const docId = await addReminder(
                email,
                filterType,
                startDate,
                replacementDate
            );
            console.log('Reminder added with ID:', docId);

            // Show success modal
            document.getElementById('successModal').style.display = 'block';

            // Reset form
            document.getElementById('reminderForm').reset();
            document.getElementById('replacementDate').value = '';
        } catch (error) {
            console.error('Error adding reminder:', error);
            // Add this new code:
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Something went wrong. Try again later.';
            errorMessage.style.color = 'red';
            errorMessage.style.fontWeight = 'bold';
            document.getElementById('reminderForm').appendChild(errorMessage);
            // Remove the error message after 5 seconds
            setTimeout(() => errorMessage.remove(), 5000);
        }
    });

document
    .getElementById('shareButton')
    .addEventListener('click', async function () {
        const friendEmail = document.getElementById('friendEmail').value;
        const shareMessage = document.getElementById('shareMessage');

        if (friendEmail) {
            try {
                await shareWithFriend(friendEmail);
                shareMessage.textContent = 'Successful share!';
                shareMessage.className = 'success';
            } catch (error) {
                console.error('Error sharing with friend:', error);
                shareMessage.textContent =
                    'Something went wrong. Try again later.';
                shareMessage.className = 'error';
            }
        } else {
            shareMessage.textContent = 'Please enter a valid email.';
            shareMessage.className = 'error';
        }
    });

// Close modal when clicking the close button
document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('successModal').style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', function (event) {
    if (event.target == document.getElementById('successModal')) {
        document.getElementById('successModal').style.display = 'none';
    }
});

// import { addReminder } from './firebase.js';

// const filterLifespans = {
//     'pur-pitcher': 2,
//     puro: 2,
//     'zerowater-pitcher': 2,
//     brita: 2,
//     'pur-faucet': 3,
//     'waterdrop-faucet': 3,
//     'aquasana-undersink': 6,
//     lifestraw: 3,
//     berkey: 6,
// };

// function updateReplacementDate() {
//     const selectedFilter = document.getElementById('filterType').value;
//     const startDateInput = document.getElementById('startDate');
//     const replacementDateInput = document.getElementById('replacementDate');

//     if (
//         selectedFilter &&
//         filterLifespans[selectedFilter] &&
//         startDateInput.value
//     ) {
//         const startDate = new Date(startDateInput.value);
//         const replacementDate = new Date(startDate);
//         replacementDate.setMonth(
//             replacementDate.getMonth() + filterLifespans[selectedFilter]
//         );
//         replacementDateInput.value = replacementDate
//             .toISOString()
//             .split('T')[0];
//     } else {
//         replacementDateInput.value = '';
//     }
// }

// document
//     .getElementById('filterType')
//     .addEventListener('change', updateReplacementDate);
// document
//     .getElementById('startDate')
//     .addEventListener('change', updateReplacementDate);

// document
//     .getElementById('reminderForm')
//     .addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const email = document.getElementById('email').value;
//         const filterType = document.getElementById('filterType').value;
//         const startDate = new Date(document.getElementById('startDate').value);
//         const replacementDate = new Date(
//             document.getElementById('replacementDate').value
//         );

//         try {
//             const docId = await addReminder(
//                 email,
//                 filterType,
//                 startDate,
//                 replacementDate
//             );
//             console.log('Reminder added with ID:', docId);

//             // Show success modal
//             document.getElementById('successModal').style.display = 'block';

//             // Reset form
//             document.getElementById('reminderForm').reset();
//             document.getElementById('replacementDate').value = '';
//         } catch (error) {
//             console.error('Error adding reminder:', error);
//             alert('Error setting reminder. Please try again.');
//         }
//     });

// // Close modal when clicking the close button
// document.getElementById('closeModal').addEventListener('click', function () {
//     document.getElementById('successModal').style.display = 'none';
// });

// // Close modal when clicking outside of it
// window.addEventListener('click', function (event) {
//     if (event.target == document.getElementById('successModal')) {
//         document.getElementById('successModal').style.display = 'none';
//     }
// });

// document
//     .getElementById('shareButton')
//     .addEventListener('click', async function () {
//         const friendEmail = document.getElementById('friendEmail').value;
//         const shareMessage = document.getElementById('shareMessage');

//         if (friendEmail) {
//             try {
//                 await shareWithFriend(friendEmail);
//                 shareMessage.textContent = 'Successful share!';
//                 shareMessage.className = 'success';
//             } catch (error) {
//                 console.error('Error sharing with friend:', error);
//                 shareMessage.textContent =
//                     'Something went wrong. Try again later.';
//                 shareMessage.className = 'error';
//             }
//         } else {
//             shareMessage.textContent = 'Please enter a valid email.';
//             shareMessage.className = 'error';
//         }
//     });
