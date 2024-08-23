import { Show, createSignal } from "solid-js";
import { Broker as Broker, BacktestingReport, MarketData, Strategy, runBacktesting } from "./BacktestingEngine";
import Editor from "./Editor";
import { MarketDataSelection, backtestingOptions, marketDatas, selectedMarketData, setBacktestingOptions, setSelectedMarketData, strategyCode } from "./EditorStore";
import { Button } from "./ui/button";
import { NumberField, NumberFieldDecrementTrigger, NumberFieldDescription, NumberFieldIncrementTrigger, NumberFieldInput, NumberFieldLabel } from "./ui/number-field";
import { Callout, CalloutContent, CalloutTitle } from "./ui/callout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function StrategyEditor(props: any) {

  const setBacktestingReport = (backtestingReport: BacktestingReport) => props.setBacktestingReport(backtestingReport);

  const [backtestingError, setBacktestingError] = createSignal<string | null>(null);

  return (
    <div>
      <div class="flex">

        { /**  FIX: add validation error on empty selection and add description */}
        <div class="w-1/3">
          <h1>Import market data</h1>
          <Select
            options={marketDatas()}
            value={selectedMarketData()}
            onChange={(option) => { console.log(option); setSelectedMarketData(option); }}
            optionTextValue="label"
            optionValue="label"
            optionDisabled="disabled"
            placeholder="Select market data"
            itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>}
          >
            <SelectTrigger aria-label="Market data">
              <SelectValue<MarketDataSelection>>{(state) => state.selectedOption().label}</SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>

        <div class="w-1/3">
          <NumberField
            defaultValue={backtestingOptions.initialBalance}
            onRawValueChange={(value) => setBacktestingOptions({ ...backtestingOptions, initialBalance: value })}
            minValue={0}>
            <NumberFieldLabel>Initial balance</NumberFieldLabel>
            <div class="relative">
              <NumberFieldInput />
              <NumberFieldIncrementTrigger />
              <NumberFieldDecrementTrigger />
            </div>
            <NumberFieldDescription>Your investement capital</NumberFieldDescription>
          </NumberField>

          {/* FIX: add step 0.001 for commission  */}
          <NumberField
            class="my-4"
            defaultValue={backtestingOptions.commissionPercentage}
            onRawValueChange={(value) => setBacktestingOptions({ ...backtestingOptions, commissionPercentage: value })}
            minValue={0}>
            <NumberFieldLabel>Commission</NumberFieldLabel>
            <div class="relative">
              <NumberFieldInput />
              <NumberFieldIncrementTrigger />
              <NumberFieldDecrementTrigger />
            </div>
            <NumberFieldDescription>Commission taken on every open/close position</NumberFieldDescription>
          </NumberField>

          <Button
            onClick={() => {
              try {
                const importedData = new MarketData(selectedMarketData().value);
                console.log(strategyCode);
                // HACK: Jesus Christ, it's taking string input, declares global variable and assign evaluated result to it - then it can be passed in rest of the code
                eval(strategyCode.value);
                const strategy: Strategy = window['strategy']

                // TODO: move below part to separated function/class
                const broker = new Broker(importedData, backtestingOptions.initialBalance, backtestingOptions.commissionPercentage);
                const backtestingResult = runBacktesting(strategy, broker);
                console.log(backtestingResult);
                setBacktestingReport(backtestingResult);
                setBacktestingError(null);
              }
              catch (e) {
                if (e instanceof Error) {
                  setBacktestingError(`${e.name}: ${e.message}`);
                  console.error(e);
                }
              }
            }
            }
          >Run strategy
          </Button>

        </div>


        <div class="ml-8 grow">
          <Show when={backtestingError()}>
            <Callout variant="error" class="my-4">
              <CalloutTitle>Error in strategy</CalloutTitle>
              <CalloutContent>
                {backtestingError()}
              </CalloutContent>
            </Callout>
          </Show>
        </div>
      </div>


      <Editor />

    </div>
  );
}
