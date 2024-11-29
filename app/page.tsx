import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { findymailCredit, hunterCredit, prospeoCredit } from "@/shared/provider";

export default async function Home() {
  const prospeo = await prospeoCredit();
  const hunter = await hunterCredit();
  const findymail = await findymailCredit();
  return (
    <>
      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Prospeo</CardTitle>
        </CardHeader>
        <CardContent>
          <table>
            <tbody>
              <tr>
                <td>Remaining Credit</td>
                <td>:</td>
                <td>{prospeo.remaining_credits}</td>
              </tr>
              <tr>
                <td>Used Credit</td>
                <td>:</td>
                <td>{prospeo.used_credits}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Hunter</CardTitle>
        </CardHeader>
        <CardContent>
          <table>
            <tbody>
              <tr>
                <td>Remaining Credit</td>
                <td>:</td>
                <td>{hunter.available}</td>
              </tr>
              <tr>
                <td>Used Credit</td>
                <td>:</td>
                <td>{hunter.used}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Findymail</CardTitle>
        </CardHeader>
        <CardContent>
          <table>
            <tbody>
              <tr>
                <td>Credits</td>
                <td>:</td>
                <td>{findymail.credits}</td>
              </tr>
              <tr>
                <td>Verifier Credit</td>
                <td>:</td>
                <td>{findymail.verifier_credits}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}
