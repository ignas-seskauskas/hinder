import { useEffect, useState } from "react";
import Hobby from "../../interfaces/Hobby";
import { BASE_API_URL } from "../../constants/api";
import authorizedFetch from "../../utils/authorizedFetch";
import ErrorMessage from "../../components/ErrorMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Button } from "react-bootstrap";

const startHobbyRecommendation = async () => {
  const response = await authorizedFetch(
    `${BASE_API_URL}/starthobbyrecommendation`,
    { method: "POST" },
    (status: number, obj) => {
      if (status === 404) {
        return null;
      }
      if (status == 200) {
        return obj;
      }
      throw new Error(`Request failed with status ${status}`);
    }
  );
  return response as Hobby;
};

const hobbyAccepted = async (hobbyId: number) => {
  await authorizedFetch(`${BASE_API_URL}/hobbyaccepted`, {
    method: "POST",
    body: JSON.stringify({
      id: Number(hobbyId),
    }),
  });
};

const dismissHobby = async (hobbyId: number) => {
  await authorizedFetch(`${BASE_API_URL}/dismisshobby`, {
    method: "POST",
    body: JSON.stringify({
      id: Number(hobbyId),
    }),
  });
};

const HobbyRecommendationsPage = () => {
  const [recommendedHobby, setRecommendedHobby] = useState<Hobby | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const nextHobby = async () => {
    try {
      setLoading(true);
      setError("");
      await startHobbyRecommendation().then(setRecommendedHobby);
    } catch (e) {
      console.error(e);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onAccept = async () => {
    setLoading(true);
    if (recommendedHobby) {
      await hobbyAccepted(recommendedHobby.id);
    }
    await nextHobby();
    setLoading(false);
  };

  const onDismiss = async () => {
    setLoading(true);
    if (recommendedHobby) {
      await dismissHobby(recommendedHobby.id);
    }
    await nextHobby();
    setLoading(false);
  };

  useEffect(() => {
    nextHobby();
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!recommendedHobby) {
    return <div>There are no more hobbies to recommend</div>;
  }

  return (
    <>
      <h3>{recommendedHobby.name}</h3>
      <div className="d-flex justify-content-start">
        <Button variant="success" className="mr-2" onClick={onAccept}>
          Accept
        </Button>
        <Button variant="danger" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </>
  );
};

export default HobbyRecommendationsPage;
