import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Parking = {
  code: string;
  parkingName: string;
  nbrAvailableSpaces: number;
  location: string;
  chargingFeePerHour: number;
};

interface SlotCardProps {
  parking: Parking;
  onClick: (p: Parking) => void;
}

const SlotCard = ({ parking, onClick }: SlotCardProps) => {
  return (
    <Card
      key={parking.code}
      onClick={() => onClick(parking)}
      className="cursor-pointer hover:shadow-lg transition-shadow"
    >
      <CardHeader>
        <CardTitle>{parking.parkingName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <strong>Code:</strong> {parking.code}
        </p>
        <p>
          <strong>Available:</strong> {parking.nbrAvailableSpaces}
        </p>
        <p>
          <strong>Location:</strong> {parking.location}
        </p>
        <p>
          <strong>Fee/hr:</strong> ${parking.chargingFeePerHour.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
};

export default SlotCard;
