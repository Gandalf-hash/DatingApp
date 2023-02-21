using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly IUnitOfWork _uow;

        public LikesController(IUnitOfWork uow)
        {
            _uow = uow;
            
            
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = (User.GetUserId());
            var LikedUsers = await _uow.UserRepository.GetUserByUsernameAsync(username);
            var SourceUser = await _uow.LikesRepository.GetUserWithLikes(sourceUserId);

            if (LikedUsers == null) return NotFound();

            if (SourceUser.UserName == username) return BadRequest("You cannot like yourself");

            var UserLike = await _uow.LikesRepository.GetUserLike(sourceUserId, LikedUsers.Id);

            if (UserLike != null) return BadRequest("You already liked this user");

            UserLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = LikedUsers.Id
            };

            SourceUser.LikedUsers.Add(UserLike);

            if (await _uow.Complete()) return Ok();

            return BadRequest("Failed to like user");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
        {

            likesParams.UserId = User.GetUserId();

            var users = await _uow.LikesRepository.GetUserLikes(likesParams);

            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));

            return Ok(users);
        }
    }
}