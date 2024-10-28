export class Job {
  constructor(
    public id: number,
    public title: string,
    public location: string,
    public status: string,
    public description?: string,
  ) {}
}
