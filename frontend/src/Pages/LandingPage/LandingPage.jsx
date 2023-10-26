import { Flex, Text, Button, VStack, Input, HStack } from '@chakra-ui/react';
import { useMediaQuery } from 'react-responsive';

function LandingPage() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    const [email, setEmail] = useState('');

    async function handleSubscribe() {
        try {
            const response = await fetch('arn:aws:execute-api:us-east-1:247203851890:m7hepnrask/*/OPTIONS/offers', {
                method: 'POST',
                body: JSON.stringify({ email: email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });            
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                // Handle success, for example, show a success message
                alert('Subscription successful! Thank you.');
                setEmail(''); // Clear the email input field on success
            } else {
                // Handle error, for example, show an error message
                alert('Subscription failed. Please try again later.');
            }
        } catch (error) {
            console.error("There was an error subscribing:", error);
            // Handle error 
            alert('An error occurred. Please try again later.');
        }
    }
    return (
        <>
            {isMobile ? (
                <Flex w="100%" minHeight="90vh" backgroundColor="#000C89" flexDir="column" alignItems="center" justifyContent="start">
                    <Text color="white">This is the Landing Page</Text>
                </Flex>
            ) : (
                <Flex w="100%" minHeight="90vh" backgroundColor="#000C66" alignItems="center" justifyContent="space-evenly">
                    <Text color="white">This is the Landing Page</Text>
                </Flex>
            )}
        </>
    );
}

export default LandingPage;
