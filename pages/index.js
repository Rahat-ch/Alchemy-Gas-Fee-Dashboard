import styles from "../styles/Home.module.css";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import {
  LineChart,
  Line,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Home({ latestGasEstimates, averages }) {
  const maxValue = Math.max.apply(Math, latestGasEstimates.map( value => value.high));
  const minValue = Math.min.apply(Math, latestGasEstimates.map( value => value.low));
  const { low, medium, high} = averages

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div>
      <h1>Latest Gas Estimates</h1>
      <h2>Last 20 Blocks Fees in Wei</h2>
      <p>Hover For breakdown of high, medium, and low priority transaction</p>
      <LineChart width={650} height={500} data={latestGasEstimates} margin={{ left: 65, top: 80, right: 50}}>
        <Line type="monotone" dataKey="high" stroke="red" />
        <Line type="monotone" dataKey="medium" stroke="blue" />
        <Line type="monotone" dataKey="low" stroke="green" />
        <XAxis />
        <YAxis type="number" domain={[ minValue, maxValue]} />
        <Tooltip />
        <Legend />
      </LineChart>
      </div>
      <div>
      <div>
      <h2>Average gas fee in wei over the last 20 blocks</h2>
      <ul>
        <li>High Priority: {low} wei</li>
        <li>Medium Priority: {medium} wei</li>
        <li>Low Priority: {high} wei</li>
      </ul>
      </div>
      <div>
        <h2>Last 20 blocks</h2>
        {latestGasEstimates.map((estimate, i) => <li className={styles.blockItem} key={i}>{i}. {estimate.blockNumber}</li>)}
      </div>
      </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const web3 = createAlchemyWeb3(process.env.ALCHEMY_URL);
  const historicalBlocks = 20;
  const history = await web3.eth.getFeeHistory(
    historicalBlocks,
    "latest",
    [25, 50, 75]
  );
  const { reward, baseFeePerGas } = history;
  const oldestBlock = Number(history.oldestBlock);
  const latestGasEstimates = reward.map((block, i) => {
    const allGasInfo = {
      blockNumber: oldestBlock + i,
      baseFeePerGas: Number(baseFeePerGas[i]),
      priorityFeePerGas: block.map((x) => Number(x)),
    };
    return {
      blockNumber: allGasInfo.blockNumber,
      low: allGasInfo.baseFeePerGas + allGasInfo.priorityFeePerGas[0],
      medium: allGasInfo.baseFeePerGas + allGasInfo.priorityFeePerGas[1],
      high: allGasInfo.baseFeePerGas + allGasInfo.priorityFeePerGas[2],
    };
  });

  const calculateAverage = (arr) => {
    const sum = arr.reduce((a, v) => a + v)
    return Math.round(sum/arr.length)
  }

  const currentBlock = await web3.eth.getBlock("pending");
  const currentBaseFeePerGas = Number(currentBlock.baseFeePerGas)
  const lowAverage = calculateAverage(latestGasEstimates.map(estimate => estimate.low));
  const midAverage = calculateAverage(latestGasEstimates.map(estimate => estimate.medium));
  const highAverage = calculateAverage(latestGasEstimates.map(estimate => estimate.high));

  return {
    props: {
      latestGasEstimates,
      averages : {
        low: lowAverage + currentBaseFeePerGas,
        medium: midAverage + currentBaseFeePerGas,
        high: highAverage + currentBaseFeePerGas
      }
    },
  };
}
