export class GetPostByIdQuery {
  constructor(
    public id: string,
    public userId: string | null,
  ) {}
}
