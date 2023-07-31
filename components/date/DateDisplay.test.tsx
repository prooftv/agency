import { act, render, screen } from "../../jest.utils";
import DateDisplay from "./DateDisplay";
import "@testing-library/jest-dom";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("DateDisplay", () => {
  it("renders default datetime", async () => {
    await act(() => {
      render(<DateDisplay locale="en" datetime="2023-07-20T07:36:00.000Z" />);
    });
    expect(screen.getByText("July 20, 2023")).toBeInTheDocument();
  });

  it("renders from date", async () => {
    await act(() => {
      render(<DateDisplay locale="en" from="2023-07-20T07:36:00.000Z" />);
    });
    expect(screen.getByText("July 20, 2023 at 09:36")).toBeInTheDocument();
  });

  it("renders to date", async () => {
    await act(() => {
      render(<DateDisplay locale="en" to="2023-07-20T07:36:00.000Z" />);
    });
    expect(screen.getByText("July 20, 2023 at 09:36")).toBeInTheDocument();
  });

  it("renders from to", async () => {
    await act(() => {
      render(
        <DateDisplay
          locale="en"
          from="2022-07-20T07:36:00.000Z"
          to="2023-07-20T07:36:00.000Z"
        />,
      );
    });
    expect(screen.getByText("July 20, 2022 at 09:36")).toBeInTheDocument();
    expect(screen.getByText("July 20, 2023 at 09:36")).toBeInTheDocument();
  });

  it("renders from to same date", async () => {
    await act(() => {
      render(
        <DateDisplay
          locale="en"
          from="2023-07-20T07:00:00.000Z"
          to="2023-07-20T07:36:00.000Z"
        />,
      );
    });
    expect(
      screen.getByText("July 20, 2023 at 09:00 – 09:36"),
    ).toBeInTheDocument();
  });
});
